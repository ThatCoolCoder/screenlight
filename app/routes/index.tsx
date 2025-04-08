import { useState } from "react";
import Background  from "~/components/Background";
import BottomMenu from "~/components/BottomMenu";
import type { SlideSet, Slide } from "~/data/Slides";


export default function Index() {
    const [playing, setPlaying] = useState(false);

    // when double click on this (and not children), pause/play
    function onDoubleClick(e: React.MouseEvent) {
        if (e.target != e.currentTarget) return;
        let newPlaying = ! playing;
        setPlaying(newPlaying);
        if (newPlaying) document.body.requestFullscreen();
        else document.exitFullscreen();
    }

    // prevent double click selecting text
    function onMouseDown(e: React.MouseEvent) {
        if (e.detail > 1) {
            e.preventDefault();
        }
    }

    return <div className="h-screen text-center flex flex-col justify-end"
        onDoubleClick={onDoubleClick}
        onMouseDown={onMouseDown}>
        <Background slides={presets[0].slides} playing={playing} />

        <BottomMenu playing={playing} />
    </div>
}

const presets: SlideSet[] = [
    {
        name: "Warning",
        slides: [
            {
                durationMs: 750,
                transitionDuration: 250,
                sections: [
                    { widthPercent: 100, color: "#FFB800" },
                ]
            },
            {
                durationMs: 500,
                transitionDuration: 250,
                sections: [
                    { widthPercent: 100, color: "black" },
                ]
            }
        ]
    }
]