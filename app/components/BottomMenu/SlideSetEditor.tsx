import { Button, ColorInput, Fieldset, Group, InputLabel, SegmentedControl, Select, Stack, Text } from "@mantine/core";

import { createBlankSlide, type Slide, type SlideSection, type SlideSet } from "~/data/Slides";
import type { StateBundle } from "~/data/StateBundle";
import { deleteIndex, updateIndex } from "~/services/misc";

import { BetterNumberInput } from "~/components/overrides/BetterNumberInput";
import { EditButton } from "~/components/overrides/EditButton";
import { OurTooltip } from "~/components/overrides/OurTooltip";

export default function SlideSetEditor({slideSet, slideIdx}: {slideSet: StateBundle<SlideSet>, slideIdx: StateBundle<number>}) {
    function addSlide() {
        slideSet.set({
            ...slideSet.val,
            slides: [...slideSet.val.slides, createBlankSlide()]
        });
    }

    function duplicateSlide() {
        slideSet.set({
            ...slideSet.val,
            slides: [...slideSet.val.slides, {...slideSet.val.slides[slideIdx.val]}]
        })
    }

    function updateSlide(newVal: Slide) {
        slideSet.set({
            ...slideSet.val,
            slides: updateIndex(slideSet.val.slides, newVal, slideIdx.val)
        });
    }

    function deleteSlide() {
        if (deleteSlideBlocked) return;

        slideSet.set({
            ...slideSet.val,
            slides: slideSet.val.slides.filter((_, idx) => idx != slideIdx.val)
        });
        if (slideIdx.val > 0) slideIdx.set(slideIdx.val - 1);
    }

    const slide = slideSet.val.slides[slideIdx.val];

    const deleteSlideBlocked = slideSet.val.slides.length <= 1;

    return <Stack gap={10}>
        <Group  pb={4} className="border-b-1 border-white">
            <Text fz="h4">Slides</Text>
            <Group gap={5}>
                <SegmentedControl data={slideSet.val.slides.map((_, idx) => String(idx + 1))}
                    value={String(slideIdx.val + 1)} onChange={v => slideIdx.set(Number(v) - 1)}/>

                <OurTooltip label="Add slide">
                    <EditButton className="h-full m-0" onClick={addSlide}>
                        <i className="bi-plus-lg"></i>
                    </EditButton>
                </OurTooltip>
                <OurTooltip label="Duplicate slide">
                    <EditButton className="h-full m-0" onClick={duplicateSlide}>
                        <i className="bi-copy"></i>
                    </EditButton>
                </OurTooltip>
                <OurTooltip label={deleteSlideBlocked ? "Cannot delete only slide" : "Delete this slide"}>
                    <EditButton className="h-full m-0" onClick={deleteSlide} disabled={deleteSlideBlocked}>
                        <i className="bi-trash"></i>
                    </EditButton>
                </OurTooltip>
            </Group>
        </Group>
        {slide != undefined && <>
            <SlideEditor slide={slide} save={updateSlide} />
        </>}
    </Stack>
}

function SlideEditor({slide, save}: {slide: Slide, save: (a: Slide) => void}) {
    return <div className="flex flex-col sm:flex-row sm:gap-5">
        <Stack gap="xs" justify="center">
            <Group>
                <InputLabel>Duration (ms)</InputLabel>
                <BetterNumberInput w="10ch" value={slide.durationMs} onNumberChange={v => save({...slide, durationMs: v})} />
            </Group>
            <Group>
                <InputLabel>Transition (ms)</InputLabel>
                <BetterNumberInput w="10ch" value={slide.transitionDuration} onNumberChange={v => save({...slide, transitionDuration: v})} />
            </Group>
            <Group>
                <InputLabel>Direction</InputLabel>
                <Select data={["vertical", "horizontal"]} value={slide.vertical ? "vertical" : "horizontal"}
                    onChange={v => save({...slide, vertical: (v == "vertical")}) } />
            </Group>
        </Stack>
        <Fieldset legend="Colors" bg="none" p="xs" className="grow flex justify-center">
            <SlideSectionsEditor slide={slide} save={save} />
        </Fieldset>
    </div>
}

function SlideSectionsEditor({slide, save}: {slide: Slide, save: (a: Slide) => void}) {
    function updateSection(section: SlideSection, idx: number) {
        save({
            ...slide,
            sections: updateIndex(slide.sections, section, idx)
        });
    }

    function deleteSection(idx: number) {
        if (slide.sections.length == 1) return;
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

    const deleteSectionBlocked = slide.sections.length <= 1;

    return <Stack gap={5}>
        {slide.sections.map((section, idx) => <Group key={idx} gap="xs" >
            <OurTooltip label="Section color">
                <ColorInput w="12ch" value={section.color} onChange={v => updateSection({...section, color: v}, idx)} format="hex" />
            </OurTooltip>
            <OurTooltip label="Section size">
                <BetterNumberInput w="10ch" suffix="%" min={0} max={100}
                    value={section.widthPercent} onNumberChange={v => updateSection({...section, widthPercent: v}, idx)} />
            </OurTooltip>
            {slide.sections.length >= 1 &&
                <OurTooltip label={deleteSectionBlocked ? "Cannot delete last section" : "Remove section"}>
                    <EditButton onClick={() => deleteSection(idx)} disabled={deleteSectionBlocked}> <i className="bi-trash"></i></EditButton>
                </OurTooltip>
            }
        </Group>)}
        <OurTooltip label="Add section to this slide">
            <Button c="black" variant="white" onClick={addSection}><i className="bi-plus-lg"></i></Button>
        </OurTooltip>
    </Stack>
}