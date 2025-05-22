import type { SlideSet } from "./Slides";

export const black: SlideSet = {
    inbuilt: true,
    slides: [
        {
            durationMs: 10000,
            transitionDuration: 0,
            vertical: false,
            sections: [{ widthPercent: 100, color: "#000" }]
        }
    ]
}

export const warning: SlideSet = {
    inbuilt: true,
    slides: [
        {
            durationMs: 750,
            transitionDuration: 250,
            vertical: false,
            sections: [
                { widthPercent: 100, color: "#FFB800" },
            ]
        },
        {
            durationMs: 500,
            transitionDuration: 250,
            vertical: false,
            sections: [
                { widthPercent: 100, color: "#000" },
            ]
        }
    ]
}