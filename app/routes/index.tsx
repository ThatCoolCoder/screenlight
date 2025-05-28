import { useEffect, useState } from "react";

import { forceLoad, load, type Settings, type TSlideSetName } from "~/data/Settings";
import { black } from "~/data/SlideSetPresets";
import type { SlideSet } from "~/data/Slides";
import { makeStateBundle, type StateBundle } from "~/data/StateBundle";
import type { StateSetter } from "~/data/StateSetter";

import Background from "~/components/Background";
import BottomMenu from "~/components/BottomMenu/BottomMenu";
import slideSetManager, { InvalidName, NoSlideSets } from "~/services/slideSetManager";


export default function Index() {
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        let loaded = load();
        if (loaded == null) {
            // todo: make it be smart or something
            setSettings(forceLoad());
        } else {
            setSettings(loaded);
        }
    }, []);

    return settings == null ?
        <div className="h-screen bg-black"></div> :
        <MainApplication settings={makeStateBundle(settings, setSettings as StateSetter<Settings>)} />
}

function MainApplication({settings}: {settings: StateBundle<Settings>}) {
    const [playing, setPlaying] = useState(false);
    const [slideSet, setSlideSet] = useState<SlideSet | null>(null);
    const [slideSetName, _setSlideSetName] = useState<TSlideSetName>(settings.val.lastUsedSet);
    const [slideIdx, setSlideIdx] = useState(0);

    function setSlideSetName(n: TSlideSetName) {
        if (n == slideSetName) return;
        console.log(n);
        _setSlideSetName(n);
        setSlideIdx(0);
    }

    useEffect(() => {
        try {
            let slideSetVal = slideSetManager.get(slideSetName, settings.val.slideSets);
            setSlideSet(slideSetVal);
        } catch (e) {
            if (! (e instanceof InvalidName)) throw e;
            
            try {
                let [name, val] = slideSetManager.getFirst(settings.val.slideSets);
                setSlideSetName(name);
                setSlideSet(val);
            }
            catch (e) {
                if (! (e instanceof NoSlideSets)) throw e;
                setSlideSetName("");
            }
        }
    }, [])


    // when double click on this (and not children), pause/play
    function onDoubleClick(e: React.MouseEvent) {
        if (e.target != e.currentTarget) return;
        let newPlaying = ! playing;
        setPlaying(newPlaying);
        if (settings.val.fullscreenOnPlay) {
            if (newPlaying) document.body.requestFullscreen();
            else document.exitFullscreen();
        }
    }

    // prevent double click selecting text
    function onMouseDown(e: React.MouseEvent) {
        if (e.detail > 1) {
            e.preventDefault();
        }
    }

    return <div className="h-screen text-center flex flex-col justify-end"
        onDoubleClick={onDoubleClick}
        onMouseDown={onMouseDown}>
        <Background slides={slideSet?.slides ?? black.slides} playing={playing} slideIdx={makeStateBundle(slideIdx, setSlideIdx)} />

        <BottomMenu playing={playing} settings={settings}
            slideSet={makeStateBundle(slideSet, setSlideSet)}
            slideIdx={makeStateBundle(slideIdx, setSlideIdx)}
            setName={makeStateBundle(slideSetName, setSlideSetName)} />
    </div>
}