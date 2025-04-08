import { useState } from "react";
import Background  from "~/components/Background";
import type { SlideSet, Slide } from "~/data/Slides";


export default function Index() {
    const [playing, setPlaying] = useState(true);

    return <div className="text-center h-screen">
        <Background slides={presets[0].slides} playing />
    </div>
}

const presets: SlideSet[]  = [
    {
        name: "Warning",
        slides: [
            {
                durationMs: 750,
                transitionDuration: 250,
                sections: [
                    {widthPercent: 100, color: "#FFB800"},
                ]
            },
            {
                durationMs: 500,
                transitionDuration: 250,
                sections: [
                    {widthPercent: 100, color: "black"},
                ]
            }
        ]
    }
]