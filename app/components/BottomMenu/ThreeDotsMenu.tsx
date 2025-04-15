import { Menu, Stack, Text, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useState } from "react";

import { createBlankSlideSet, type SlideSet } from "~/data/Slides";
import type { StateBundle } from "~/data/StateBundle";
import { deleteIndex, updateIndex } from "~/services/misc";

import ConfirmCancelButtons from "~/components/general/ConfirmCancelButtons";
import { EditButton } from "~/components/overrides/EditButton";

export default function ThreeDotsMenu({slideSets, slideSet}: {slideSets: StateBundle<SlideSet[]>, slideSet: StateBundle<SlideSet | null>}) {
    // Menu with 3 dots icon that gives options to manage presets
    // Yes I know i could break this up into more components but it would really just be more boilerplate so this is fine in its own file

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