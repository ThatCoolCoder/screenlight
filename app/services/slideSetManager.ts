// manager thing to try centralise logic for mutating slide sets list

import type { TSlideSets } from "~/data/Settings";
import type { SlideSet } from "~/data/Slides";

export class InvalidId extends Error { }
export class DuplicateName extends Error { }
export class EmptyName extends Error { }

function cleanSet(set: SlideSet) {
    // clean up the set in preparation for persisting

    return {
        ...set,
        name: set.name.trim(),
    }
}

function findValidId(allSets: TSlideSets): number {
    // come up with a valid id that's not in use already

    const keys = Object.keys(allSets);

    let i = 0;
    while (keys.includes(String(i))) i++;

    return i;
}

export default {
    get(id: string, allSets: TSlideSets): SlideSet | Error {
        if (! (id in allSets)) return new InvalidId();
        
        return allSets[id];
    },

    add(set: SlideSet, allSets: TSlideSets): [TSlideSets, SlideSet, string] | Error {
        set = cleanSet(set);

        if (set.name == "") return new EmptyName();
        if (Object.values(allSets).some(set2 => set2.name == set.name)) return new DuplicateName();

        const id = findValidId(allSets);
        allSets = {[id]: set, ...allSets};

        return [allSets, set, String(id)];

    },

    update(id: string, set: SlideSet, allSets: TSlideSets): [TSlideSets, SlideSet] | Error {
        set = cleanSet(set);

        if (! (id in allSets)) return new InvalidId();
        if (set.name == "") return new EmptyName();
        if (Object.keys(allSets).some(id2 => allSets[id2].name == set.name && String(id) != id2)) return new DuplicateName();

        allSets = {[id]: set, ...allSets};

        return [allSets, set];
    },

    delete(id: string, allSets: TSlideSets): TSlideSets | Error {
        if (! (id in allSets)) return new InvalidId();

        const clone = {...allSets};
        delete clone[id];
        return clone;
    },
}

