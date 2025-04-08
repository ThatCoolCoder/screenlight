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