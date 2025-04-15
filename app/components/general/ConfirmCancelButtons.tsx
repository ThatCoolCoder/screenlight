import { Button, Group } from "@mantine/core";
import { modals } from "@mantine/modals";

export default function ConfirmCancelButtons({confirm, cancel, confirmText, cancelText}:
    {confirm?: () => void, cancel?: () => void, confirmText?: string, cancelText?: string}) {

    return <Group mt="auto" justify="end" gap="xs">
        <Button onClick={() => { modals.closeAll(); cancel && cancel() }} variant="outline" color="red">{cancelText ?? "Cancel"}</Button>
        <Button onClick={() => { modals.closeAll(); confirm && confirm() }}>{confirmText ?? "Ok"} </Button>
    </Group>
}