import { Button, Checkbox, Group, MultiSelect, Select, Space, Stack, Tabs, Text, TextInput, Textarea, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { getDefaultSettings, save, type Settings } from "~/data/Settings";
import type { StateBundle } from "~/data/StateBundle";
import ConfirmCancelButtons from "./general/ConfirmCancelButtons";
import { Fragment, useState } from "react";
import { exportSlideSets, importSlideSets } from "~/services/importExport";
import { useClipboard } from "@mantine/hooks";
import { type SlideSet } from "~/data/Slides";

export default function AdvancedSettings({settings}: {settings: StateBundle<Settings>}) {
    // todo: create nice mobile-friendly tabs thing where tabs disappear when you're in the tab then there's a back button

    const isSmallScreen = document.body.clientWidth < 600;

    return <Tabs defaultValue="importexport" orientation={isSmallScreen ? "horizontal" : "vertical"} mih="500">
        <Tabs.List>
            <Tabs.Tab value="importexport">Import/export</Tabs.Tab>
            <Tabs.Tab value="managedata">Manage your data</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="importexport" px="md">
            <ImportExportTab settings={settings} />
        </Tabs.Panel>
        <Tabs.Panel value="managedata" px="md">
            <ManageDataTab settings={settings} />
        </Tabs.Panel>
    </Tabs>
}

function ImportExportTab({settings}: {settings: StateBundle<Settings>}) {
    return <Stack gap="xs">
        <Title order={4}>Import/export presets</Title>

        <ExportMenu settings={settings} />
        
        <Space />
        <ImportMenu settings={settings} />
    </Stack>
}

function ExportMenu({settings}: {settings: StateBundle<Settings>}) {
    const [selected, setSelected] = useState<string[]>([]);

    const clipboard = useClipboard();
    
    function tryCopy() {
        clipboard.copy(exportResult);
    }

    const slideSets = settings.val.slideSets;
    const exportResult = selected.length > 0 ? exportSlideSets(slideSets.filter(ss => selected.includes(ss.name))) : "";

    return <Stack gap="xs">
        <Title order={5}>Export to text</Title>
        <MultiSelect value={selected} onChange={v => setSelected(v)} data={slideSets.map(ss => ss.name)} clearable label="Select presets" />

        <Group>
            <Textarea value={exportResult} onChange={() => {}} className="grow" />
            {clipboard.copied
                ? <Text c="blue">
                    <i className="bi bi-check2 mr-2"></i>
                    Copied
                </Text>
                : <Button leftSection={<i className="bi bi-copy"></i>} disabled={exportResult == ""} onClick={tryCopy}>Copy</Button>
            }
        </Group>
    </Stack>
}

function ImportMenu({settings}: {settings: StateBundle<Settings>}) {
    type State = "prepaste" | "selecting";

    const [state, setState] = useState<State>("prepaste");
    const [pasted, setPasted] = useState(false);
    const [options, setOptions] = useState<SlideSet[]>([]);
    const [selected, setSelected] = useState<boolean[]>([]);

    function onPaste(text: string) {
        console.log(pasted);
        // if (! pasted) return;

        setPasted(false);
        setOptions(importSlideSets(text));
        setSelected([]);
        setState("selecting");
    }

    function completeImport() {
        const toAdd: SlideSet[] = [];
        selected.forEach((val, idx) => {
            if (! val) return;
            toAdd.push(options[idx]);
        });

        const newSettings = {
            ...settings.val,
            slideSets: [...settings.val.slideSets, ...toAdd]
        };
        settings.set(newSettings);
        save(newSettings);

        setState("prepaste");
        setPasted(false);
    }

    return <Stack gap="xs">
        <Title order={5}>Import from text</Title>
        {state == "prepaste" && <>
            <TextInput placeholder="Paste here to begin" w="full" onPaste={e => setPasted(true)} onChange={e => onPaste(e.target.value)}/>
        </>}
        {state == "selecting" && <>
            Found {options.length} preset(s)
            {options.map((o, idx) => <Fragment key={idx}>
                <Checkbox checked={selected[idx] == true} label={o.name} onChange={e => {
                    const clone = [...selected];
                    clone[idx] = e.target.checked;
                    setSelected(clone);
                }} />
            </Fragment>)}
            <Button onClick={completeImport}>Import {selected.filter(x => x).length} preset(s) </Button>
        </>}
    </Stack>
}

function ManageDataTab({settings}: {settings: StateBundle<Settings>}) {
    const totalPresets = settings.val.slideSets.length;
    const userPresets = settings.val.slideSets.length;
    const defaultPresets = 0;

    function restoreInbuiltPresets() {
        function apply() {
            alert("Sorry can't do this until there is tracking for which ones are inbuilt");
        }

        modals.open({
            title: "Confirm deletion",
            children: <Stack>
                <Text fz="sm" className="mb-5">
                    Are you sure you want to delete all presets you have created? This action cannot be undone.
                </Text>
                <ConfirmCancelButtons confirm={apply} />
            </Stack>
        });

    }

    function removeUserPresets() {
        function apply() {
            alert("Sorry can't do this until there is tracking for which ones are inbuilt")
        }

        modals.open({
            title: "Confirm deletion",
            children: <Stack>
                <Text fz="sm" className="mb-5">
                    Are you sure you want to delete all presets you have created? This action cannot be undone.
                </Text>
                <ConfirmCancelButtons confirm={apply} />
            </Stack>
        });
    }

    function clearAllData() {
        function apply() {
            let newSettings = getDefaultSettings();
            settings.set(newSettings);
            save(newSettings);
            location.reload();
        }

        modals.open({
            title: "Confirm clear user data",
            children: <Stack>
                <Text fz="sm" className="mb-5">
                    Are you sure you want to clear all user data? This will reset all settings and remove all presets you have created.
                </Text>
                <ConfirmCancelButtons confirm={apply} />
            </Stack>
        });
    }

    return <Stack align="start" gap="xs">
        <Title order={4}>Manage user data</Title>
        <Text>
            {totalPresets} {totalPresets == 1 ? "preset" : "presets"} stored
            ({userPresets} user / {defaultPresets} inbuilt)
        </Text>

        <Group>
            <Button variant="outline" onClick={restoreInbuiltPresets}>Restore inbuilt presets</Button>
            <Button variant="outline" color="red" onClick={removeUserPresets}>Remove user presets</Button>
            <Button variant="outline" color="red" onClick={clearAllData}>Clear all user data</Button>
        </Group>
        
    </Stack>
}