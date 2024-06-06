import { createContext, useState } from 'react';

const IsFetchProfileContext = createContext();

function IsFetchProfileProvider({ children }) {
    const [isFetch, setIsFetch] = useState(false);

    const value = {
        isFetch,
        setIsFetch,
    };

    return <IsFetchProfileContext.Provider value={value}>{children}</IsFetchProfileContext.Provider>;
}

export { IsFetchProfileContext, IsFetchProfileProvider };
