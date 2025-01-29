import { useState, useEffect } from 'react';
import { loadState, saveState } from '../../utils/localStorage';

const usePersistedState = (key, defaultValue) => {
    const [state, setState] = useState(() => loadState(key, defaultValue));

    useEffect(() => {
        saveState(key, state);
    }, [key, state]);

    return [state, setState];
};

export default usePersistedState;
