import { Button, Checkbox, Group, MultiSelect, Select, Space, Stack, Tabs, Text, TextInput, Textarea, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { getDefaultSettings, save, type Settings, type TSlideSetName, type TSlideSets } from "~/data/Settings";
import type { StateBundle } from "~/data/StateBundle";
import ConfirmCancelButtons from "./general/ConfirmCancelButtons";
import { Fragment, useState } from "react";
import { exportSlideSets, importSlideSets } from "~/services/importExport";
import { useClipboard } from "@mantine/hooks";
import { OurTooltip } from "./overrides/OurTooltip";

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
    return <Stack gap="s">
        <Title order={4}>Import/export presets</Title>

        <ExportMenu settings={settings} />
        
        <Space />
        <ImportMenu settings={settings} />
    </Stack>
}

function ExportMenu({settings}: {settings: StateBundle<Settings>}) {
    const [selected, _setSelected] = useState<string[]>([]);
    const [exportResult, setExportResult] = useState<string>("");

    function setSelected(v: string[]) {
        _setSelected(v);

        const result: TSlideSets = {};
        v.forEach(name => result[name] = slideSets[name]);
        setExportResult(exportSlideSets(result));
    }

    const clipboard = useClipboard();
    
    function tryCopy() {
        clipboard.copy(exportResult);
    }

    const slideSets = settings.val.slideSets;

    return <Stack gap="xs">
        <Title order={5}>Export to text</Title>
        <MultiSelect value={selected} onChange={v => setSelected(v)} data={Object.keys(slideSets)} clearable label="Select presets" />

        <Group>
            <Textarea value={selected.length > 0 ? exportResult : ""} onChange={() => {}} className="grow" />
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
    const [error, setError] = useState("");
    const [options, setOptions] = useState<TSlideSets>({});
    const [selected, setSelected] = useState<Record<TSlideSetName, boolean>>({});

    function onPaste(text: string) {
        if (text == "") {
            setError("");
            return;
        }

        try {
            setOptions(importSlideSets(text));
        } catch (e) {
            setError("Data format not recognised");
            return;
        }
        setSelected({});
        setState("selecting");
    }

    function completeImport() {
        let allSets = {...settings.val.slideSets};
        Object.keys(selected).forEach(name => {
            if (selected[name]) {
                allSets[name] = options[name];
            }
        });

        const newSettings = {
            ...settings.val,
            slideSets: allSets
        };
        settings.set(newSettings);
        save(newSettings);

        setState("prepaste");
        setError("");
    }

    return <Stack gap="xs">
        <Title order={5}>Import from text</Title>
        {state == "prepaste" && <>
            <TextInput placeholder="Paste exported data here" w="full"  onChange={e => onPaste(e.target.value)}/>
            <Text c="red">{error}</Text>
        </>}
        {state == "selecting" && <>
            Select presets to import:
            {Object.keys(options).map(name => <Fragment key={name}>
                <Checkbox checked={selected[name] == true} label={name} onChange={e => {
                    const clone = {...selected};
                    clone[name] = e.target.checked;
                    setSelected(clone);
                }} />
            </Fragment>)}
            <Button onClick={completeImport}>Import {Object.values(selected).filter(x => x).length} preset(s) </Button>
        </>}
    </Stack>
}

function ManageDataTab({settings}: {settings: StateBundle<Settings>}) {
    const presetsList = Object.values(settings.val.slideSets);
    const totalPresets = presetsList.length;
    const userPresets = presetsList.filter(p => !p.inbuilt).length;
    const defaultPresets = presetsList.filter(p => p.inbuilt).length;

    function saveSettings(nextSettings: Settings) {
        settings.set(nextSettings);
        save(nextSettings);
        location.reload();
    }

    function restoreInbuiltPresets() {
        const nextPresets: TSlideSets = {...settings.val.slideSets};
        const defaults = getDefaultSettings().slideSets; // grab default settings for its slidesets
        Object.keys(defaults)
            .forEach(name => nextPresets[name] = defaults[name]);

        saveSettings({...settings.val, slideSets: nextPresets})

    }

    function removeUserPresets() {
        function apply() {
            const nextPresets: TSlideSets = {};
            Object.keys(settings.val.slideSets).forEach(name => {
                const set = settings.val.slideSets[name];
                if (set.inbuilt) nextPresets[name] = {...set};
            });
            saveSettings({...settings.val, slideSets: nextPresets});
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
            saveSettings(getDefaultSettings());
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
            <OurTooltip label="Repairs inbuilt presets without modifying custom ones">
                <Button variant="outline" onClick={restoreInbuiltPresets}>Restore inbuilt presets</Button>
            </OurTooltip>
                <Button variant="outline" color="red" onClick={removeUserPresets}>Remove user presets</Button>
            <Button variant="outline" color="red" onClick={clearAllData}>Clear all user data</Button>
        </Group>
        
    </Stack>
}