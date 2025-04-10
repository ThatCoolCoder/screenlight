export type SlideSet = {
    name: string,
    slides: Slide[]
}

export type Slide = {
    durationMs: number,
    transitionDuration: number,
    sections: SlideSection[]
}

export type SlideSection = {
    color: string,
    widthPercent: number,
}

export function createBlankSlide(): Slide {
    return {
        durationMs: 1000,
        transitionDuration: 0,
        sections: [
            { color: "black", widthPercent: 100 }
        ]
    }
}