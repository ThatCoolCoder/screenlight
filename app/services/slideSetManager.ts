// manager thing to try centralise logic for mutating slide sets list

import type { TSlideSets } from "~/data/Settings";
import type { SlideSet } from "~/data/Slides";

export class NoSlideSets extends Error { }
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

function findValidId(allSets: TSlideSets): string {
    // come up with a valid id that's not in use already

    const keys = Object.keys(allSets);

    let i = 0;
    while (keys.includes(String(i))) i++;

    return String(i);
}

export default {
    get(id: string, allSets: TSlideSets): SlideSet {
        if (! (id in allSets)) throw new InvalidId();
        
        return allSets[id];
    },

    getFirst(allSets: TSlideSets): [string, SlideSet] {
        if (Object.keys(allSets).length == 0) throw new NoSlideSets();
        const id = Object.keys(allSets)[0];
        return [id, allSets[id]];
    },

    add(set: SlideSet, allSets: TSlideSets): [TSlideSets, SlideSet, string] {
        set = cleanSet(set);

        if (set.name == "") throw new EmptyName();
        if (Object.values(allSets).some(set2 => set2.name == set.name)) throw new DuplicateName();

        const id = findValidId(allSets);
        allSets = {[id]: set, ...allSets};

        return [allSets, set, id];
    },

    update(id: string, set: SlideSet, allSets: TSlideSets): [TSlideSets, SlideSet] {
        set = cleanSet(set);

        if (! (id in allSets)) throw new InvalidId();
        if (set.name == "") throw new EmptyName();
        if (Object.keys(allSets).some(id2 => allSets[id2].name == set.name && id != id2)) throw new DuplicateName();

        allSets = {[id]: set, ...allSets};

        return [allSets, set];
    },

    delete(id: string, allSets: TSlideSets): TSlideSets {
        if (! (id in allSets)) throw new InvalidId();

        const clone = {...allSets};
        delete clone[id];
        return clone;
    },
}

