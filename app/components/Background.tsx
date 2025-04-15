import { useEffect } from "react";

import type { Slide } from "~/data/Slides";
import type { StateSetter } from "~/data/StateSetter";


export default function Background({slides, playing, slideIdx, setSlideIdx}: {slides: Slide[], playing: boolean, slideIdx: number, setSlideIdx: StateSetter<number>}) {
    const slide = slides[slideIdx];

    useEffect(() => {
        if (!playing) return;

        const t = setTimeout(() => {
            setSlideIdx((slideIdx + 1) % slides.length);
        }, slide.durationMs);
        return () => clearTimeout(t);
    }, [playing, slides, slideIdx]);

    return <div className="layer flex" style={{ zIndex: -10 }}>
        {slide.sections.map((s, i) =>
            <div key={i} style={{
                transitionProperty: "background-color, width",
                transitionDuration: slide.transitionDuration / 1000 + "s",
                transitionTimingFunction: "ease",

                width: s.widthPercent + "%",
                backgroundColor: s.color
            }}></div>
        )}
    </div>
}