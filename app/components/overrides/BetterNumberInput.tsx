import { NumberInput, type NumberInputProps } from "@mantine/core";
import { useRef, useState } from "react";

export interface BetterNumberInputProps extends NumberInputProps {
    onNumberChange: (n: number) => void
}

export function BetterNumberInput(props: BetterNumberInputProps) {
    // this is a number input that won't return a string sometimes (stupid mantine)

    const [stringValue, setStringValue] = useState(String(props.value));
    const prevValue = useRef(props.value);

    // If the value is updated outside the component, update our string value to match
    if (prevValue.current != props.value) setStringValue(String(props.value));
    prevValue.current = props.value;

    function onChange(v: string | number) {
        setStringValue(v.toString());
        if (typeof v == "number") props.onNumberChange(v);
    }

    return <NumberInput {...props} value={stringValue} onChange={onChange} />
}