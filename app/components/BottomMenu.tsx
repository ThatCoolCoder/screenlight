import { Fieldset, Group, Menu, Select, Stack, Switch, Text, TextInput, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";

import { save, type Settings } from "~/data/Settings";
import { createBlankSlideSet, type SlideSet } from "~/data/Slides";
import { makeStateBundle, type StateBundle } from "~/data/StateBundle";
import { deleteIndex, updateIndex } from "~/services/misc";

import SlideSetEditor from "./SlideSetEditor";
import ConfirmCancelButtons from "./general/ConfirmCancelButtons";
import { EditButton } from "./overrides/EditButton";
import { OurTooltip } from "./overrides/OurTooltip";

import "./BottomMenu.css";

export default function BottomMenu({playing, settings, slideSet, slideIdx}:
    {playing: boolean, settings: StateBundle<Settings>, slideSet: StateBundle<SlideSet | null>, slideIdx: StateBundle<number>}) {

    const [editing, setEditing] = useState(false);

    return <div className={"bottom-menu " + (playing ? "bottom-menu-closed" : "")}>
        <div className="flex flex-row w-screen justify-center">
            <div className="rounded-xl border-1 border-white grow mx-3 mb-3 py-3 px-3 bg-black/10 text-white max-w-250">
                <Title order={3} className="text-pulse" mb="md">Double click to play/pause</Title>
                <Stack>
                    <SettingsEditor settings={settings} slideSet={slideSet} editing={makeStateBundle(editing, setEditing)} />
                    {slideSet.val != null && editing &&
                        <Fieldset bg="none" p="xs">
                            <SlideSetEditor slideSet={slideSet as StateBundle<SlideSet>} slideIdx={slideIdx} />
                        </Fieldset>
                    }
                </Stack>
            </div>
        </div>
    </div>
}

function SettingsEditor({settings, slideSet, editing}: {settings: StateBundle<Settings>, slideSet: StateBundle<SlideSet | null>, editing: StateBundle<boolean>}) {
    function setAutoFullscreen(enabled: boolean) {
        const newSettings = {...settings.val, fullscreenOnPlay: enabled}
        settings.set(newSettings);
        save(newSettings);
    }

    function setSlideSets(val: SlideSet[]) {
        const newSettings = {...settings.val, slideSets: val};
        settings.set(newSettings);
        save(newSettings);
    }

    return <Group justify="center" gap={50}>
        <PresetSelector
            editing={editing}
            slideSet={slideSet}
            slideSets={makeStateBundle(settings.val.slideSets, setSlideSets)} />
        <Switch label="Fullscreen on play" labelPosition="left" checked={settings.val.fullscreenOnPlay} onChange={v => setAutoFullscreen(v.target.checked)} />

    </Group>
}

function PresetSelector({slideSet, slideSets, editing}: {slideSet: StateBundle<SlideSet | null>, slideSets: StateBundle<SlideSet[]>, editing: StateBundle<boolean>}) {
    function trySetActive(name: string | null, force: boolean = false) {
        const set = slideSets.val.filter(s => s.name == name)[0];
        if (set == undefined) {
            slideSet.set(null);
            return;
        }

        // todo: && check if changed
        if (editing.val && !force) {
            // todo: better ux we need save, dont save and dont do anythign
            modals.open({
                title: "Preset has been edited",
                size: "lg",
                children: <>
                    <Text fz="sm">
                        The current preset has been modified. Would you like to save your changes before switching preset?
                    </Text>
                    <ConfirmCancelButtons cancelText="Discard" confirmText="Save" confirm={savePreset} cancel={revertPreset} />
                </>
            })
            return;
        }

        slideSet.set({...set})
    }

    function savePreset() {
        if (slideSet.val == null) return;
        editing.set(false);

        slideSets.set(updateIndex(slideSets.val, slideSet.val, index));
    }

    function revertPreset() {
        if (slideSet.val == null) return;
        editing.set(false);

        slideSet.set(slideSets.val[index]);
    }

    const index = slideSets.val.findIndex(s => s.name == slideSet.val?.name);

    const slideSetNames = slideSets.val.map(s => s.name);

    return <Group gap={3}>
        <OurTooltip label="Select preset">
            <Select value={slideSet.val?.name} onChange={v => trySetActive(v)} data={slideSetNames} w="20ch" placeholder="(No presets available)"/>
        </OurTooltip>
        {editing.val ? <>
            <OurTooltip label="Save changes">
                <EditButton onClick={savePreset}><i className="bi bi-check2"></i></EditButton>
            </OurTooltip>
            <OurTooltip label="Exit without saving">
                <EditButton onClick={revertPreset}><i className="bi bi-x-lg"></i></EditButton>
            </OurTooltip>
        </> : <>
            <OurTooltip label="Edit">
                <EditButton onClick={() => editing.set(true)} disabled={slideSet.val == null}><i className="bi bi-pencil"></i></EditButton>
            </OurTooltip>
            <ThreeDotsMenu slideSets={slideSets} slideSet={slideSet}/>
        </>}
    </Group>
}

function ThreeDotsMenu({slideSets, slideSet}: {slideSets: StateBundle<SlideSet[]>, slideSet: StateBundle<SlideSet | null>}) {
    function addPreset() {
        function apply(name: string) {
            const newSet = createBlankSlideSet(name);
            slideSets.set([...slideSets.val, newSet]);
            slideSet.set(newSet);
        }

        modals.open({
            title: "Create new preset",
            children: <NewPresetPopup onSave={apply} />
        })
    }

    function renamePreset() {
        function apply(name: string) {
            if (slideSet.val == null) return;

            const updated = {...slideSet.val!, name: name};
            slideSets.set(updateIndex(slideSets.val, updated, index));
            slideSet.set(updated);
        }

        modals.open({
            title: "Rename",
            children: <RenamePopup onSave={apply} />
        })
    }

    function clonePreset() {
        const newSet = createBlankSlideSet(findAvailableName("Copy of " + slideSet.val!.name));
        slideSets.set([...slideSets.val, newSet]);
        slideSet.set(newSet);
    }

    function deletePreset() {
        function apply() {
            if (slideSet.val == null) return;
            slideSets.set(deleteIndex(slideSets.val, index));
            slideSet.set(null);
        }

        modals.open({
            title: "Confirm delete",
            children: <Stack>
                <Text fz="sm" className="mb-5">
                    Are you sure you want to delete "{slideSet.val?.name}"?
                </Text>
                <ConfirmCancelButtons confirm={apply} />
            </Stack>
        })
    }

    function findAvailableName(baseName: string) {
        const usedNames = slideSets.val.map(ss => ss.name);

        if (! usedNames.includes(baseName)) return baseName;
        let number = 1;
        while (usedNames.includes(baseName + " " + number)) number ++;
        return baseName + " " + number;
    }

    const index = slideSets.val.findIndex(s => s.name == slideSet.val?.name);

    return <Menu shadow="md" trigger="hover" offset={0}>
        <Menu.Target>
            <EditButton title="Other options"><i className="bi bi-three-dots-vertical"></i></EditButton>
        </Menu.Target>

        <Menu.Dropdown>
            <Menu.Label ml="-5">Manage presets</Menu.Label>
            <Menu.Item onClick={addPreset} leftSection={<i className="bi bi-plus-lg"></i>}>
                New preset
            </Menu.Item>

            <Menu.Item onClick={renamePreset} leftSection={<i className="bi bi-pencil"></i>} disabled={slideSet.val == null}>
                Rename current
            </Menu.Item>

            <Menu.Item onClick={clonePreset} leftSection={<i className="bi bi-copy"></i>} disabled={slideSet.val == null}>
                Clone current
            </Menu.Item>

            <Menu.Item onClick={deletePreset} leftSection={<i className="bi bi-trash"></i>} disabled={slideSet.val == null}>
                Delete current
            </Menu.Item>
        </Menu.Dropdown>
    </Menu>
}

function RenamePopup({onSave}: {onSave: (a: string) => void}) {
    const [name, setName] = useState("");
    
    return <Stack>
        <TextInput value={name} onChange={v => setName(v.target.value)} placeholder="Enter new name..."/>
        <ConfirmCancelButtons confirm={() => onSave(name)} confirmText="Save" cancelText="Cancel" />  
    </Stack>
}

function NewPresetPopup({onSave}: {onSave: (a: string) => void}) {
    const [name, setName] = useState("");
    
    return <Stack>
        <TextInput value={name} onChange={v => setName(v.target.value)} placeholder="Enter preset name..."/>
        <ConfirmCancelButtons confirm={() => onSave(name)} confirmText="Create" cancelText="Cancel" />  
    </Stack>
}