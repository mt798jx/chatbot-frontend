/**
 * Loads the state from localStorage.
 * @param {string} key - The key under which the state is stored.
 * @param {*} defaultValue - The default value to return if no state is found.
 * @returns {*} - The loaded state or the default value.
 */
export const loadState = (key, defaultValue) => {
    try {
        const serializedState = localStorage.getItem(key);
        if (serializedState === null) {
            return defaultValue;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error(`Error loading state for key "${key}":`, err);
        return defaultValue;
    }
};

/**
 * Saves the state to localStorage.
 * @param {string} key - The key under which to store the state.
 * @param {*} state - The state to store.
 */
export const saveState = (key, state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(key, serializedState);
    } catch (err) {
        console.error(`Error saving state for key "${key}":`, err);
    }
};