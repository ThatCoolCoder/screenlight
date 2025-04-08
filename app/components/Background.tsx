import { useEffect, useRef } from "react";

export default function Background() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let index = 0;

        let timeout: NodeJS.Timeout;

        function nextColor() {
            index ++;
            if (index >= colors.length) index = 0;
            ref.current!.style.backgroundColor = colors[index];
            timeout = setTimeout(nextColor, delay);
        }
        nextColor();
        return () => clearTimeout(timeout);
    })

    return <div className="layer" ref={ref}></div>
}

const colors = ["red", "blue", "green"];
const delay = 1000;