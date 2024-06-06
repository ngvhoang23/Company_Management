import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import { Fragment } from 'react';
import ProtectedRoutes from './AuthComponent/ProtectedRoutes';
import LogIn from './pages/LogIn/LogIn';
import DefaultLayout from './Layouts/DefaultLayout/DefaultLayout';
import { useEffect } from 'react';
import { IsLoadingContext, IsLoadingProvider } from './Context/LoadingContext';
import ContextWrapper from './ContextWrapper/ContextWrapper';
import GlobalModal from './components/GlobalModal/GlobalModal';

function App() {
    useEffect(() => {
        document.title = 'Company Management';
    });

    return (
        <Router basename="/">
            <div className="App">
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <ContextWrapper>
                                <GlobalModal>
                                    <LogIn />
                                </GlobalModal>
                            </ContextWrapper>
                        }
                    />
                    {publicRoutes.map((route, ind) => {
                        const Layout = route.layout ? route.layout : Fragment;
                        const Page = route.component;
                        return (
                            <Route
                                key={ind}
                                path={route.path}
                                element={
                                    <ProtectedRoutes>
                                        <Page />
                                    </ProtectedRoutes>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
