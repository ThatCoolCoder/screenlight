import type { TSlideSets } from "~/data/Settings";

export function importSlideSets(stringData: string) {
    return JSON.parse(atob(stringData)) as TSlideSets;
}

export function exportSlideSets(slideSets: TSlideSets) {
    return btoa(JSON.stringify(slideSets));
}