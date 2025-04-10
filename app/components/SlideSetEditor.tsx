import { ActionIcon, Button, ColorInput, Fieldset, Group, InputLabel, NumberInput, Pagination, Paper, SegmentedControl, Stack, Text } from "@mantine/core";
import { useMemo, useState } from "react";
import { createBlankSlide, type Slide, type SlideSection, type SlideSet } from "~/data/Slides";
import type { StateBundle } from "~/data/StateBundle";
import type { StateSetter } from "~/data/StateSetter";
import { deleteIndex, updateIndex } from "~/services/misc";

export default function SlideSetEditor({slideSet, slideIdx}: {slideSet: StateBundle<SlideSet>, slideIdx: StateBundle<number>}) {
    function addSlide() {
        slideSet.set({
            ...slideSet.val,
            slides: [...slideSet.val.slides, createBlankSlide()]
        });
    }

    function updateSlide(newVal: Slide) {
        slideSet.set({
            ...slideSet.val,
            slides: updateIndex(slideSet.val.slides, newVal, slideIdx.val)
        });
    }

    function deleteSlide() {
        slideSet.set({
            ...slideSet.val,
            slides: slideSet.val.slides.filter((_, idx) => idx != slideIdx.val)
        });
        if (slideIdx.val > 0) slideIdx.set(slideIdx.val - 1);
    }

    const slide = slideSet.val.slides[slideIdx.val]

    return <Stack gap={10}>
        <Group  pb={4} className="border-b-1 border-white">
            <Text fz="h4">Slide</Text>
            <Group gap={5}>
                <SegmentedControl data={slideSet.val.slides.map((_, idx) => String(idx + 1))} value={String(slideIdx.val + 1)} onChange={v => slideIdx.set(Number(v) - 1)}/>
                <Button variant="white" c="black" size="compact" className="h-full m-0" onClick={addSlide} p="xs">
                    <i className="bi-plus-lg"></i>
                </Button>
                <Button variant="white" c="black" className="h-full m-0" onClick={deleteSlide} p="xs">
                    <i className="bi-trash"></i>
                </Button>
            </Group>
        </Group>
        {slide != undefined && <>
            <SlideEditor slide={slide} save={updateSlide} />
        </>}
        {/* <Pagination total={slideSet.val.slides.length} value={slideIdx.val + 1} onChange={v => slideIdx.set(v - 1)}/> */}
    </Stack>
}

function SlideEditor({slide, save}: {slide: Slide, save: (a: Slide) => void}) {
    function updateSection(section: SlideSection, idx: number) {
        save({
            ...slide,
            sections: updateIndex(slide.sections, section, idx)
        });
    }

    function deleteSection(idx: number) {
        save({
            ...slide,
            sections: deleteIndex(slide.sections, idx)
        })
    }

    function addSection() {
        save({
            ...slide,
            sections: [...slide.sections, {
                color: "#ff0000",
                widthPercent: 50
            }]
        })
    }

    return <Stack gap="xs">
        <Group>
            <InputLabel>Duration (ms)</InputLabel>
            <NumberInput w="10ch" value={slide.durationMs} onChange={v => save({...slide, durationMs: Number(v)})}></NumberInput>
        </Group>
        <Group>
            <InputLabel>Transition (ms)</InputLabel>
            <NumberInput w="10ch" value={slide.transitionDuration} onChange={v => save({...slide, transitionDuration: Number(v)})}></NumberInput>
        </Group>
        <Fieldset legend="Colors" bg="none" p="xs" mr={{base: 0, xs: "auto"}}>
            <Stack gap={5}>
                {slide.sections.map((section, idx) => <Group key={idx} gap="xs" >
                    <ColorInput w="12ch"
                        value={section.color} onChangeEnd={v => updateSection({...section, color: v}, idx)} />
                    <NumberInput w="10ch" suffix="%" min={1} max={100} title="width"
                        value={section.widthPercent} onChange={v => updateSection({...section, widthPercent: Number(v)}, idx)}></NumberInput>
                    {slide.sections.length >= 1 && <Button variant="white" c="black" p="xs"
                        onClick={() => deleteSection(idx)}>
                        <i className="bi-trash"></i>
                    </Button>}
                </Group>)}
                <Button c="black" variant="white" onClick={addSection}><i className="bi-plus-lg"></i></Button>
            </Stack>
        </Fieldset>
    </Stack>
}