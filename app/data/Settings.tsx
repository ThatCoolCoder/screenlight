import type { SlideSet } from "./Slides";
import * as presets from "./SlideSetPresets";

export type Settings = {
    fullscreenOnPlay: boolean,
    slideSets: SlideSet[]
}

const defaultSettings: Settings = {
    fullscreenOnPlay: true,
    slideSets: [
        presets.warning,
        presets.black
    ]
}

const localStorageKey = "screenLightSettings.0";

export function load(): Settings | null {
    if (! (localStorageKey in localStorage)) return cloneDefaultSettings();

    try {
        return JSON.parse(localStorage[localStorageKey]);
    }
    catch (e) {
        console.log("Failed loading settings: " + e)
        return null;
    }
}

export function forceLoad(): Settings {
    return load() ?? cloneDefaultSettings();
}

export function save(s: Settings): boolean {
    localStorage[localStorageKey] = JSON.stringify(s);

    return true;
}


function cloneDefaultSettings() {
    return JSON.parse(JSON.stringify(defaultSettings));
}