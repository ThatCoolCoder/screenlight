import type { SlideSet } from "./Slides";
import * as presets from "./SlideSetPresets";

export type Settings = {
    fullscreenOnPlay: boolean,
    slideSets: TSlideSets,
}

export type TSlideSets = Record<string, SlideSet>

const defaultSettings: Settings = {
    fullscreenOnPlay: true,
    slideSets: {
        0: presets.warning,
        1: presets.black
    }
}

const localStorageKey = "screenLightSettings.1";

export function load(): Settings | null {
    if (! (localStorageKey in localStorage)) return getDefaultSettings();

    try {
        return JSON.parse(localStorage[localStorageKey]);
    }
    catch (e) {
        console.log("Failed loading settings: " + e)
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


export function getDefaultSettings() {
    return JSON.parse(JSON.stringify(defaultSettings));
}