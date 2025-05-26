import type { SlideSet } from "./Slides";
import * as presets from "./SlideSetPresets";

export type Settings = {
    lastUsedSet: string,
    fullscreenOnPlay: boolean,
    slideSets: TSlideSets,
}

export type TSlideSetName = string;
export type TSlideSets = Record<TSlideSetName, SlideSet>

const defaultSettings: Settings = {
    lastUsedSet: "", 
    fullscreenOnPlay: true,
    slideSets: {
        "Warning Flash": presets.warning,
        "Black": presets.black
    }
}

const localStorageKey = "screenLightSettings.2";

export function load(): Settings | null {
    if (! (localStorageKey in localStorage)) return getDefaultSettings();

    try {
        return JSON.parse(localStorage[localStorageKey]);
    }
    catch (e) {
        console.log("Failed loading settings: " + e);
        return null;
    }
}

export function forceLoad(): Settings {
    return load() ?? getDefaultSettings();
}

export function save(s: Settings): boolean {
    localStorage[localStorageKey] = JSON.stringify(s);

    return true;
}


export function getDefaultSettings(): Settings {
    return JSON.parse(JSON.stringify(defaultSettings));
}