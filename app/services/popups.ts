export function ourConfirm(question: string, yesAction: () => void, noAction: () => void, yesText: string = "Ok", noText: string = "Cancel") {
    confirm(question) ? yesAction() : noAction();
}

export function ourDisplayNotification(title: string, text: string, onClose = () => {}) {
    alert(text);
    onClose();
}