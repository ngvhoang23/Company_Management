import axios from 'axios';
import { useContext, useEffect } from 'react';
import Cookies from 'universal-cookie';
import { IsFetchProfileContext } from '~/Context/IsFetchProfileContext';
import { UserInfoContext } from '~/Context/UserInfoContext';

const cookies = new Cookies();

function LogicWrapper({ children }) {
    const userInfoContext = useContext(UserInfoContext);
    const userInfo = userInfoContext.userInfo;
    const setUserInfo = userInfoContext.setUserInfo;

    const isFetchProfileContext = useContext(IsFetchProfileContext);
    const isFetch = isFetchProfileContext.isFetch;
    const setIsFetch = isFetchProfileContext.setIsFetch;

    useEffect(() => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/employees/inindividual-info`,
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        axios(configuration)
            .then((result) => {
                setUserInfo(result.data[0]);
            })
            .catch((error) => {
                error = new Error();
                console.log(error);
            });
    }, [isFetch]);

    return <>{children}</>;
}

export default LogicWrapper;
