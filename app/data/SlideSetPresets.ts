import type { SlideSet } from "./Slides";

export const black: SlideSet = {
    name: "Black",
    slides:[
        {
            durationMs: 10000,
            transitionDuration: 0,
            sections: [{ widthPercent: 100, color: "#000" }]
        }
    ]
}

export const warning: SlideSet = {
    name: "Warning Flash",
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
                { widthPercent: 100, color: "#000" },
            ]
        }
    ]
}