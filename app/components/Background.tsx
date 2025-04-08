import { useEffect, useReducer, useRef, useState } from "react";
import type { Slide } from "~/data/Slides";

export default function Background({slides, playing}: {slides: Slide[], playing: boolean}) {
    const [, reRender] = useReducer(x => x + 1, 0);
    
    // Can't use state for the main effects as we use a setinterval to determine when to re-render and the state stuff in there won't update
    const ref = useRef<HTMLDivElement>(null);
    const interval = useRef<NodeJS.Timeout>(null);
    const timeRemaining = useRef(0);
    const slideIdx = useRef(0);

    useEffect(() => {
        setSlide(0);

        interval.current = setInterval(() => {
            if (! playing) return;
            timeRemaining.current -= 10;
            if (timeRemaining.current <= 0) setSlide(slideIdx.current + 1);
        }, 10);

        return () => clearInterval(interval.current ?? -1);
    }, [slides, playing]);

    function setSlide(idx: number) {
        while (idx >= slides.length) idx -= slides.length;
        timeRemaining.current = slides[idx].durationMs;
        slideIdx.current = idx;
        reRender();
    }

    const slide = slides[slideIdx.current];

    return <div className="layer flex" style={{ zIndex: -10 }} ref={ref}>
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