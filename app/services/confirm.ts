export function ourConfirm(question: string ,yesAction: () => {}, noAction: () => {}, yesText = "Ok", noText: "Cancel") {
    confirm(question) ? yesAction() : noAction();
}