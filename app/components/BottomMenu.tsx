import { Button, Fieldset, Grid, Group, InputLabel, MenuLabel, Select, SimpleGrid, Stack, Switch, Text, Title } from "@mantine/core";
import "./BottomMenu.css";
import type { StateBundle } from "~/data/StateBundle";
import { save, type Settings } from "~/data/Settings";
import type { SlideSet } from "~/data/Slides";
import SlideSetEditor from "./SlideSetEditor";
import { useRef } from "react";
import { updateIndex } from "~/services/misc";

export default function BottomMenu({playing, settings, slideSet, slideIdx}:
    {playing: boolean, settings: StateBundle<Settings>, slideSet: StateBundle<SlideSet | null>, slideIdx: StateBundle<number>}) {
    return <div className={"bottom-menu " + (playing ? "bottom-menu-closed" : "")}>
        <div className="flex flex-row w-screen justify-center">
            <div className="rounded-xl border-1 border-white grow mx-3 mb-3 py-3 px-3 bg-black/10 text-white max-w-250">
                <Title order={3} className="text-pulse" mb="md">Double click to play/pause</Title>
                <Stack>
                    <SettingsEditor settings={settings} slideSet={slideSet} />
                    {slideSet.val != null && 
                        <Fieldset bg="none" p="xs">
                            <SlideSetEditor slideSet={slideSet as StateBundle<SlideSet>} slideIdx={slideIdx} />
                        </Fieldset>
                    }
                </Stack>
            </div>
        </div>
    </div>
}

function SettingsEditor({settings, slideSet}: {settings: StateBundle<Settings>, slideSet: StateBundle<SlideSet | null>}) {
    const origSlideSet = useRef<SlideSet | null>(null);

    function setActive(name: string | null) {
        const set = settings.val.slideSets.filter(s => s.name == name)[0];
        if (set == undefined) {
            slideSet.set(null);
            return;
        }

        // clone so we don't save changes to it by default
        slideSet.set(JSON.parse(JSON.stringify(set)));
        // origSlideSet
    }

    function setAutoFullscreen(enabled: boolean) {
        const newSettings = {...settings.val, fullscreenOnPlay: enabled}
        settings.set(newSettings);
        save(newSettings);
    }

    function updateSlideSets(slideSets: SlideSet[]) {
        const newSettings = {...settings.val, slideSets: slideSets};
        settings.set(newSettings);
        save(newSettings);
    }

    function saveSet() {
        const idx = settings.val.slideSets.findIndex(s => s.name == slideSet.val?.name);
        if (slideSet.val == null || idx == -1) return;
        updateSlideSets(updateIndex(settings.val.slideSets, slideSet.val, idx));
    }

    function revertSet() {

    }

    function duplicateSet() {
        if (slideSet.val == null) return;
        updateSlideSets([...settings.val.slideSets, {
            ...slideSet.val,
            name: "Copy of " + slideSet.val.name
        }]);
        setActive("Copy of " + slideSet.val.name);
    }

    return <Group justify="center" gap={50}>
        <Group gap={3}>
            <InputLabel fz="h3">Preset &ensp; </InputLabel>
            <Select value={slideSet.val?.name} onChange={v => setActive(v)} data={settings.val.slideSets.map(s => s.name)} w="20ch" />
            <Button variant="white" color="black" px="xs" onClick={saveSet}><i className="bi bi-floppy"></i></Button>
            <Button variant="white" color="black" px="xs" onClick={revertSet}><i className="bi bi-arrow-counterclockwise"></i></Button>
            <Button variant="white" color="black" px="xs" onClick={duplicateSet}><i className="bi bi-copy"></i></Button>
        </Group>
        <Switch label="Fullscreen on play" labelPosition="left" checked={settings.val.fullscreenOnPlay} onChange={v => setAutoFullscreen(v.target.checked)} />

    </Group>
}