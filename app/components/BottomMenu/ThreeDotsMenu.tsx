import { Menu, Stack, Text, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";

import { createBlankSlideSet, type SlideSet } from "~/data/Slides";
import type { StateBundle } from "~/data/StateBundle";

import ConfirmCancelButtons from "~/components/general/ConfirmCancelButtons";
import { EditButton } from "~/components/overrides/EditButton";
import type { TSlideSetName, TSlideSets } from "~/data/Settings";
import slideSetManager, { NoSlideSets } from "~/services/slideSetManager";
import { OurTooltip } from "../overrides/OurTooltip";

export default function ThreeDotsMenu({slideSets, slideSet, setName}:
    {   slideSets: StateBundle<TSlideSets>,
        slideSet: StateBundle<SlideSet | null>,
        setName: StateBundle<TSlideSetName>
    }) {
    // Menu with 3 dots icon that gives options to manage presets
    // Yes I know i could break this up into more components but it would really just be more boilerplate so this is fine in its own file

    function addPreset() {
        function apply(name: string) {
            const newSet = createBlankSlideSet();

            const [newName, updated] = slideSetManager.add(name, newSet, slideSets.val);

            
            slideSets.set(updated);
            slideSet.set(newSet);
            setName.set(newName);
        }

        modals.open({
            title: "Create new preset",
            children: <NewPresetPopup onSave={apply} />
        })
    }

    function renamePreset() {
        function apply(name: string) {
            if (slideSet.val == null) return;

            const [newName, allSets] = slideSetManager.rename(setName.val, name, slideSets.val);

            slideSets.set(allSets);
            setName.set(newName);
        }

        modals.open({
            title: "Rename",
            children: <RenamePopup onSave={apply} />
        })
    }

    function clonePreset() {
        const newSet = {...slideSet.val!};
        const [name, allSets] = slideSetManager.add(findAvailableName("Copy of " + setName), newSet, slideSets.val);

        slideSets.set(allSets);
        slideSet.set(newSet);
        setName.set(name);
    }

    function deletePreset() {
        function apply() {
            if (slideSet.val == null) return;
            const newSlideSets = slideSetManager.delete(setName.val, slideSets.val);
            slideSets.set(newSlideSets);

            try {
                let [name, set] = slideSetManager.getFirst(newSlideSets);
                slideSet.set(set);
                setName.set(name);
            } catch (e) {
                if (! (e instanceof NoSlideSets)) throw e;
                slideSet.set(null);
                setName.set("");
            }
        }

        modals.open({
            title: "Confirm delete",
            children: <Stack>
                <Text fz="sm" className="mb-5">
                    Are you sure you want to delete "{setName.val}"?
                </Text>
                <ConfirmCancelButtons confirm={apply} />
            </Stack>
        })
    }

    function findAvailableName(baseName: string) {
        const usedNames = Object.keys(slideSets.val);

        if (! usedNames.includes(baseName)) return baseName;
        let number = 1;
        while (usedNames.includes(baseName + " " + number)) number ++;
        return baseName + " " + number;
    }

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