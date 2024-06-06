import { createContext, useState } from 'react';

const ConfirmContext = createContext();

function ConfirmProvider({ children }) {
    const [confirmFunc, setConfirmFunc] = useState(false);

    const value = {
        confirmFunc,
        setConfirmFunc,
    };

    return <ConfirmContext.Provider value={value}>{children}</ConfirmContext.Provider>;
}

export { ConfirmContext, ConfirmProvider };
