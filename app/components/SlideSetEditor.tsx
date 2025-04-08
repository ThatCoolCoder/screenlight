import { Pagination } from "@mantine/core";
import { useState } from "react";
import type { SlideSet } from "~/data/Slides";

export default function SlideSetEditor({slideSet}: {slideSet: SlideSet}) {
    const [activeSlide, setActiveSlide] = useState(1);

    return <>
        {slideSet.slides[activeSlide] != undefined && <>
            
        </>}
        <Pagination total={slideSet.slides.length} value={activeSlide} onChange={setActiveSlide}/>
    </>
}