import { Text, Title } from "@mantine/core";
import "./BottomMenu.css";

export default function BottomMenu({playing}: {playing: boolean}) {
    return <div className={"bottom-menu " + (playing ? "bottom-menu-closed" : "")}>
        <div className="flex flex-row w-screen justify-center">
            <BottomMenuContent />
        </div>
    </div>
}

function BottomMenuContent() {
    return <div className="rounded-xl border-1 border-white grow mx-3 mb-3 py-3 px-5 bg-black/10 text-white">
        <div className="flex w-full justify-center">
            <Title order={4} className="text-pulse">Double click to unpause</Title>
        </div>
    </div>
}