import { createContext, useState } from 'react';

const UserInfoContext = createContext();

function UserInfoProvider({ children }) {
    const [userInfo, setUserInfo] = useState({});

    const value = {
        userInfo,
        setUserInfo,
    };

    return <UserInfoContext.Provider value={value}>{children}</UserInfoContext.Provider>;
}

export { UserInfoContext, UserInfoProvider };
