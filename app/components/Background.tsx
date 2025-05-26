import { useEffect } from "react";

import type { Slide } from "~/data/Slides";
import type { StateBundle } from "~/data/StateBundle";


export default function Background({slides, playing, slideIdx}: {slides: Slide[], playing: boolean, slideIdx: StateBundle<number>}) {
    // Rendering logic for the actual lighting part of the application

    const slide = slides[slideIdx.val];

    useEffect(() => {
        if (!playing) return;

        const t = setTimeout(() => {
            slideIdx.set((slideIdx.val + 1) % slides.length);
        }, slide.durationMs);
        return () => clearTimeout(t);
    }, [playing, slides, slideIdx]);

    return <div className={"layer flex" + (slide.vertical ? " flex-col" : "")} style={{ zIndex: -10 }}>
        {slide.sections.map((s, i) =>
            <div key={i} style={{
                transitionProperty: "background-color, width, height",
                transitionDuration: slide.transitionDuration / 1000 + "s",
                transitionTimingFunction: "ease",

                [slide.vertical ? "height" : "width"]: s.widthPercent + "%",
                backgroundColor: s.color
            }}></div>
        )}
    </div>
}