import { Button, Fieldset, Grid, Group, InputLabel, MenuLabel, Select, SimpleGrid, Stack, Switch, Text, Title } from "@mantine/core";
import "./BottomMenu.css";
import type { StateBundle } from "~/data/StateBundle";
import { save, type Settings } from "~/data/Settings";
import type { SlideSet } from "~/data/Slides";
import SlideSetEditor from "./SlideSetEditor";

export default function BottomMenu({playing, settings, slideSet, slideIdx}:
    {playing: boolean, settings: StateBundle<Settings>, slideSet: StateBundle<SlideSet>, slideIdx: StateBundle<number>}) {
    return <div className={"bottom-menu " + (playing ? "bottom-menu-closed" : "")}>
        <div className="flex flex-row w-screen justify-center">
            <div className="rounded-xl border-1 border-white grow mx-3 mb-3 py-3 px-3 bg-black/10 text-white max-w-250">
                <Title order={3} className="text-pulse" mb="md">Double click to play/pause</Title>
                {/* <hr /> */}
                <Stack>
                    <SettingsEditor settings={settings} slideSet={slideSet} />
                    <Fieldset bg="none" p="xs">
                        <SlideSetEditor slideSet={slideSet} slideIdx={slideIdx} />
                    </Fieldset>
                </Stack>
            </div>
        </div>
    </div>
}

function SettingsEditor({settings, slideSet}: {settings: StateBundle<Settings>, slideSet: StateBundle<SlideSet>}) {
    function setActive() {

    }

    function setAutoFullscreen(enabled: boolean) {
        const newSettings = {...settings.val, fullscreenOnPlay: enabled}
        settings.set(newSettings);
        save(newSettings);
    }

    return <Group justify="center" gap={50}>
        {/* <Switch checked={settings.val.fullscreenOnPlay} onChange={e => setChecked()} */}
        <Group gap={3}>
            <InputLabel fz="h3">Preset &ensp; </InputLabel>
            <Select onChange={v => setActive(v)} data={settings.val.slideSets.map(s => s.name)} w="20ch" />
            <Button variant="white" color="black" px="xs"><i className="bi bi-floppy"></i></Button>
            <Button variant="white" color="black" px="xs"><i className="bi bi-arrow-counterclockwise"></i></Button>
            <Button variant="white" color="black" px="xs"><i className="bi bi-copy"></i></Button>
        </Group>
        <Switch label="Fullscreen on play" labelPosition="left" checked={settings.val.fullscreenOnPlay} onChange={v => setAutoFullscreen(v.target.checked)} />

    </Group>
}