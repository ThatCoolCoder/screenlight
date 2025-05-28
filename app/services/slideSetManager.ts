// manager thing to try centralise logic for mutating slide sets list

import type { TSlideSets, TSlideSetName } from "~/data/Settings";
import type { SlideSet } from "~/data/Slides";

export class NoSlideSets extends Error { }
export class InvalidName extends Error { }
export class DuplicateName extends Error { }

function cleanSet(set: SlideSet) {
    // clean/validate the set in preparation for persisting
    // (turns out currently nothing is needed to be done)


    return {
        ...set
    }
}

function cleanSetName(name: TSlideSetName) {
    return name.trim();
}

export default {
    get(name: TSlideSetName, allSets: TSlideSets): SlideSet {
        name = cleanSetName(name);
        
        if (! (name in allSets)) throw new InvalidName();
        
        return allSets[name];
    },

    getFirst(allSets: TSlideSets): [TSlideSetName, SlideSet] {
        if (Object.keys(allSets).length == 0) throw new NoSlideSets();

        const name = Object.keys(allSets)[0];
        return [name, allSets[name]];
    },

    add(name: TSlideSetName, set: SlideSet, allSets: TSlideSets): [TSlideSetName, TSlideSets] {
        set = cleanSet(set);
        name = cleanSetName(name);

        if (name == "") throw new InvalidName();
        if (name in allSets) throw new DuplicateName();

        return [name, {...allSets, [name]: set}];
    },

    rename(name: TSlideSetName, newName: TSlideSetName, allSets: TSlideSets): [TSlideSetName, TSlideSets] {
        name = cleanSetName(name);
        
        if (! (name in allSets)) throw new InvalidName();

        const set = allSets[name];
        delete allSets[name];

        return this.add(newName, set, allSets);   
    },

    update(name: TSlideSetName, set: SlideSet, allSets: TSlideSets): TSlideSets {
        name = cleanSetName(name);
        set = cleanSet(set);

        if (! (name in allSets)) throw new InvalidName();
        
        return {...allSets, [name]: set};
    },

    delete(name: string, allSets: TSlideSets): TSlideSets {
        name = cleanSetName(name);
        if (! (name in allSets)) throw new InvalidName();

        const clone = {...allSets};
        delete clone[name];
        return clone;
    },
}

