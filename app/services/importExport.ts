import type { SlideSet } from "~/data/Slides";

export function importSlideSets(stringData: string) {
    return JSON.parse(atob(stringData)) as SlideSet[];
}

export function exportSlideSets(slideSets: SlideSet[]) {
    return btoa(JSON.stringify(slideSets));
}