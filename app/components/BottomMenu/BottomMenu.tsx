import { Fieldset, Flex, Group, Modal, Select, Stack, Switch, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";

import { save, type Settings, type TSlideSets } from "~/data/Settings";
import { type SlideSet } from "~/data/Slides";
import { makeStateBundle, type StateBundle } from "~/data/StateBundle";

import ConfirmCancelButtons from "~/components/general/ConfirmCancelButtons";
import { EditButton } from "~/components/overrides/EditButton";
import { OurTooltip } from "~/components/overrides/OurTooltip";
import AdvancedSettings from "~/components/AdvancedSettings";

import SlideSetEditor from "./SlideSetEditor";
import ThreeDotsMenu from "./ThreeDotsMenu";

import "./BottomMenu.css";
import slideSetManager, { InvalidId } from "~/services/slideSetManager";

export default function BottomMenu({playing, settings, slideSet, slideIdx, setId}:
    {   playing: boolean,
        settings: StateBundle<Settings>,
        slideSet: StateBundle<SlideSet | null>,
        slideIdx: StateBundle<number>,
        setId: StateBundle<string>
    }) {

    // Menu that pops up from the bottom when paused to configure everything

    const [editing, setEditing] = useState(false);

    return <div className={"bottom-menu " + (playing ? "bottom-menu-closed" : "")}>
        <div className="flex flex-row w-screen justify-center">
            <div className="rounded-xl border-1 border-white grow mx-3 mb-3 py-3 px-3 bg-black/10 text-white max-w-250">
                <Title order={3} className="text-pulse" mb="md">Double click to play/pause</Title>
                <Stack>
                    <BottomMenuContent settings={settings} slideSet={slideSet} setId={setId} editing={makeStateBundle(editing, setEditing)} />
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

function BottomMenuContent({settings, slideSet, editing, setId}:
    {settings: StateBundle<Settings>, slideSet: StateBundle<SlideSet | null>, editing: StateBundle<boolean>, setId: StateBundle<string>}) {
    const [settingsOpen, setSettingsOpen] = useState(false);

    function setAutoFullscreen(enabled: boolean) {
        const newSettings = {...settings.val, fullscreenOnPlay: enabled}
        settings.set(newSettings);
        save(newSettings);
    }

    function setSlideSets(val: TSlideSets) {
        const newSettings = {...settings.val, slideSets: val};
        settings.set(newSettings);
        save(newSettings);
    }

    function openAdvancedSettings() {
        setSettingsOpen(true);
    }

    return <>
        <Flex justify="center" columnGap="50" rowGap="10" wrap="wrap">
            <PresetSelector
                editing={editing}
                slideSet={slideSet}
                slideSets={makeStateBundle(settings.val.slideSets, setSlideSets)}
                setId={setId} />

            <Group>
                <Switch label="Fullscreen on play" labelPosition="left" checked={settings.val.fullscreenOnPlay} onChange={v => setAutoFullscreen(v.target.checked)} />
                
                <OurTooltip label="Advanced options">
                    <EditButton className="ml-2" onClick={openAdvancedSettings}><i className="bi bi-gear"></i></EditButton>
                </OurTooltip>
            </Group>
        </Flex>
        <Modal opened={settingsOpen} onClose={() => setSettingsOpen(false)} title="Advanced Options" size="xl">
            <AdvancedSettings settings={settings} />
        </Modal>
    </>
}

function PresetSelector({slideSet, slideSets, editing, setId}:
    {slideSet: StateBundle<SlideSet | null>, slideSets: StateBundle<TSlideSets>, editing: StateBundle<boolean>, setId: StateBundle<string>}) {
    function trySetActive(id: string | null, force: boolean = false) {
        if (id == null) id = "";

        let set: SlideSet;

        set = slideSetManager.get(id, slideSets.val);

        if (set instanceof InvalidId) {
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

        slideSetManager.update(setId.val, slideSet.val, slideSets.val);
    }

    function revertPreset() {
        if (slideSet.val == null) return;
        editing.set(false);

        slideSet.set(slideSetManager.get(setId.val, slideSets.val));
    }

    const slideSetLookup = Object.keys(slideSets.val).map(id => ({label: slideSets.val[id].name, value: id}));

    return <Group gap={3}>
        <OurTooltip label="Select preset">
            <Select value={slideSet.val?.name} onChange={v => trySetActive(v)} data={slideSetLookup} w="20ch" placeholder="(No presets available)"/>
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

