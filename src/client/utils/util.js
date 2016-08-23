const updateState = (currentState, newState) => Object.assign({}, currentState, newState);

function normaliseRewire(__RewireAPI__) {
    const rewire = __RewireAPI__.__Rewire__;
    const resetDependency = __RewireAPI__.__ResetDependency__;
    return {
        rewire,
        resetDependency
    }
}

export { updateState , normaliseRewire };
