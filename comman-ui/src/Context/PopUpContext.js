import { createContext, useState } from 'react';

const PopUpContext = createContext();

function PopUpProvider({ children }) {
    const [popUp, setPopUp] = useState();

    const value = {
        popUp,
        setPopUp,
    };

    return <PopUpContext.Provider value={value}>{children}</PopUpContext.Provider>;
}

export { PopUpContext, PopUpProvider };
