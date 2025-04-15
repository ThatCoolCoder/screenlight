import { NumberInput, type NumberInputProps } from "@mantine/core";
import { useState } from "react";

export interface BetterNumberInputProps extends NumberInputProps {
    onNumberChange: (n: number) => void
}

// number input that won't return a string sometimes (stupid mantine)
export function BetterNumberInput(props: BetterNumberInputProps) {
    const [stringValue, setStringValue] = useState(String(props.value));

    function onChange(v: string | number) {
        setStringValue(v.toString());
        if (typeof v == "number") props.onNumberChange(v);
    }

    return <NumberInput {...props} value={stringValue} onChange={onChange} />
}