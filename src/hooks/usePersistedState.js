import { useState, useEffect } from 'react';
import { loadState, saveState } from '../utils/localStorage';

/**
 * A custom hook that manages state with persistence in localStorage.
 * @param {string} key - The key under which the state is stored.
 * @param {*} defaultValue - The default value for the state.
 * @returns {[*, Function]} - An array containing the state and a function to update it.
 */
const usePersistedState = (key, defaultValue) => {
    const [state, setState] = useState(() => loadState(key, defaultValue));

    useEffect(() => {
        saveState(key, state);
    }, [key, state]);

    return [state, setState];
};

export default usePersistedState;