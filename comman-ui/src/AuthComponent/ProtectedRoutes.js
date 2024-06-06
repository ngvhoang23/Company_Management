import React, { useEffect } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import DefaultLayout from '../Layouts/DefaultLayout/DefaultLayout';
import GlobalModal from '~/components/GlobalModal/GlobalModal';
import ContextWrapper from '~/ContextWrapper/ContextWrapper';
import LogIn from '~/pages/LogIn';
import LogicWrapper from '~/LogicWrapper/LogicWrapper';
import Cookies from 'universal-cookie';

// receives component and any other props represented by ...rest

const cookies = new Cookies();

export default function ProtectedRoutes({ component: Component, children, ...rest }) {
    const token = cookies.get('access_token');

    return token ? (
        <ContextWrapper>
            <GlobalModal>
                <LogicWrapper>
                    <DefaultLayout>{children}</DefaultLayout>
                </LogicWrapper>
            </GlobalModal>
        </ContextWrapper>
    ) : (
        <ContextWrapper>
            <GlobalModal>
                <LogIn />
            </GlobalModal>
        </ContextWrapper>
    );
}
