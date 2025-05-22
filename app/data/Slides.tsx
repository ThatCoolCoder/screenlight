export type SlideSet = {
    inbuilt: boolean,
    slides: Slide[]
}

export type Slide = {
    durationMs: number,
    transitionDuration: number,
    vertical: boolean,
    sections: SlideSection[]
}

export type SlideSection = {
    color: string,
    widthPercent: number,
}

export function createBlankSlideSet(): SlideSet {
    return {
        inbuilt: false,
        slides: [createBlankSlide()]
    }
}

export function createBlankSlide(): Slide {
    return {
        durationMs: 1000,
        transitionDuration: 0,
        vertical: false,
        sections: [
            { color: "#000", widthPercent: 100 }
        ]
    }
}