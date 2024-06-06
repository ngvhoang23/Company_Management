import { createContext, useState } from 'react';

const ResultStatusContext = createContext();

function ResultStatusProvider({ children }) {
    const [status, setStatus] = useState(false);

    const value = {
        status,
        setStatus,
    };

    return <ResultStatusContext.Provider value={value}>{children}</ResultStatusContext.Provider>;
}

export { ResultStatusContext, ResultStatusProvider };
