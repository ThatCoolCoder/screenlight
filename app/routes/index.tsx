import { useState, useEffect } from "react";
import Background  from "~/components/Background";
import BottomMenu from "~/components/BottomMenu";
import { type Settings, forceLoad, load } from "~/data/Settings";
import { black } from "~/data/SlideSetPresets";
import type { SlideSet, Slide } from "~/data/Slides";
import { makeStateBundle, type StateBundle } from "~/data/StateBundle";
import type { StateSetter } from "~/data/StateSetter";
import { ourConfirm } from "~/services/confirm";


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
    const [slideSet, setSlideSet] = useState(settings.val.slideSets[0] ?? black);
    const [slideIdx, setSlideIdx] = useState(0);


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
        <Background slides={slideSet.slides} playing={playing} slideIdx={slideIdx} setSlideIdx={setSlideIdx} />

        <BottomMenu playing={playing} settings={settings}
            slideSet={makeStateBundle(slideSet, setSlideSet)}
            slideIdx={makeStateBundle(slideIdx, setSlideIdx)} />
    </div>
}