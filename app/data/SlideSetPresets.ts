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

const rainbowDuration = 250;
const rainbowTransition = 500;

export const rainbow: SlideSet = {
    inbuilt: true,
    slides: [
        {
            durationMs: rainbowDuration,
            transitionDuration: rainbowTransition,
            vertical: false,
            sections: [
                {widthPercent: 100, color: "#f00"},
            ]
        },
        {
            durationMs: rainbowDuration,
            transitionDuration: rainbowTransition,
            vertical: false,
            sections: [
                {widthPercent: 100, color: "#f90"},
            ]
        },
        {
            durationMs: rainbowDuration,
            transitionDuration: rainbowTransition,
            vertical: false,
            sections: [
                {widthPercent: 100, color: "#cf0"},
            ]
        },
        {
            durationMs: rainbowDuration,
            transitionDuration: rainbowTransition,
            vertical: false,
            sections: [
                {widthPercent: 100, color: "#3f0"},
            ]
        },
        {
            durationMs: rainbowDuration,
            transitionDuration: rainbowTransition,
            vertical: false,
            sections: [
                {widthPercent: 100, color: "#0f6"},
            ]
        },
        {
            durationMs: rainbowDuration,
            transitionDuration: rainbowTransition,
            vertical: false,
            sections: [
                {widthPercent: 100, color: "#0ff"},
            ]
        },
        {
            durationMs: rainbowDuration,
            transitionDuration: rainbowTransition,
            vertical: false,
            sections: [
                {widthPercent: 100, color: "#06f"},
            ]
        },
        {
            durationMs: rainbowDuration,
            transitionDuration: rainbowTransition,
            vertical: false,
            sections: [
                {widthPercent: 100, color: "#30f"},
            ]
        },
        {
            durationMs: rainbowDuration,
            transitionDuration: rainbowTransition,
            vertical: false,
            sections: [
                {widthPercent: 100, color: "#c0f"},
            ]
        },
        {
            durationMs: rainbowDuration,
            transitionDuration: rainbowTransition,
            vertical: false,
            sections: [
                {widthPercent: 100, color: "#f09"},
            ]
        }
    ]
}