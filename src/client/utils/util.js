const updateState = (currentState, newState) => Object.assign({}, currentState, newState);

function normaliseRewire(__RewireAPI__) {
    const rewire = __RewireAPI__.__Rewire__;
    const resetDependency = __RewireAPI__.__ResetDependency__;
    return {
        rewire,
        resetDependency
    }
}

function handleTab(event) {
    let textarea = event.target;
    let newCaretPosition = textarea.selectionStart + 4;
    textarea.value = textarea.value.substring(0, textarea.selectionStart) 
                        + '    ' 
                        + textarea.value.substring(textarea.selectionStart, textarea.value.length);
    textarea.selectionStart = newCaretPosition;
    textarea.selectionEnd = newCaretPosition;
    textarea.focus();
}

export { updateState , normaliseRewire, handleTab };
