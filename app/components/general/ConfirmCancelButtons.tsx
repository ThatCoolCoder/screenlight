import { Button, Group } from "@mantine/core";
import { modals } from "@mantine/modals";

export default function ConfirmCancelButtons({
        confirm, cancel,
        confirmText, cancelText,
        closeOnConfirm = true, closeOnCancel = true,
        useSubmitButton = true}:
    {
        confirm?: () => void, cancel?: () => void,
        confirmText?: string, cancelText?: string,
        closeOnConfirm?: boolean, closeOnCancel?: boolean,
        useSubmitButton?: boolean
    }) {

    return <Group mt="auto" justify="end" gap="xs">
        <Button onClick={() => { closeOnCancel && modals.closeAll(); cancel && cancel() }}
            variant="outline" color="red">
            {cancelText ?? "Cancel"}
        </Button>
        <Button onClick={() => { closeOnConfirm && modals.closeAll(); confirm && confirm() }}
            type={useSubmitButton ? "submit" : "button"}>
            {confirmText ?? "Ok"}
        </Button>
    </Group>
}