import classNames from 'classnames/bind';
import styles from './LogIn.module.scss';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import axios from 'axios';
import ConfirmBox from '~/components/ConfirmBox/ConfirmBox';
import logo from '~/assets/images/joomla.png';
import Button from '~/components/Button/Button';
import { IsLoadingContext } from '~/Context/LoadingContext';
import { ResultStatusContext } from '~/Context/ResultStatusContext';
import Cookies from 'universal-cookie';
import { UserInfoContext } from '~/Context/UserInfoContext';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function LogIn() {
    const navigate = useNavigate();

    const isLoadingContext = useContext(IsLoadingContext);
    const isLoading = isLoadingContext.isLoading;
    const setIsLoading = isLoadingContext.setIsLoading;

    const resultStatusContext = useContext(ResultStatusContext);
    const resultStatus = resultStatusContext.status;
    const setResultStatus = resultStatusContext.setStatus;

    const [userName, setUserName] = useState();
    const [password, setPassword] = useState();

    const [isShowNotification, setIsShowNotification] = useState(false);

    const handleSubmit = () => {
        setIsLoading(true);
        const configuration = {
            method: 'post',
            url: `http://localhost:5000/auth/login`,
            data: {
                user_name: userName,
                password,
            },
        };
        axios(configuration)
            .then((result) => {
                const { access_token, user } = result.data;
                setIsLoading(false);
                setResultStatus({ status: 1, message: 'Success' });
                cookies.set('access_token', access_token, { path: '/' });
                window.location = '/posts';
            })
            .catch((error) => {
                setIsLoading(false);
                error = new Error();
                setIsShowNotification(true);
                setResultStatus({ status: 0, message: 'Fail :(' });
            });
    };

    return (
        <>
            <div
                className={cx('wrapper')}
                style={{ backgroundImage: `url(${require('~/assets/images/post_bg.jpg')})` }}
            >
                <div className={cx('left-side')}>
                    <img src={require('~/assets/images/login.png')} />
                </div>
                <div className={cx('log-in-box')}>
                    <div className={cx('log-in-container')}>
                        <div className={cx('header')}>
                            <img src={require('~/assets/images/logo.png')} />
                            <h2>Welcome to Kuber</h2>
                        </div>
                        <div className={cx('form-container')}>
                            <label>Log In</label>
                            <div className={cx('form-input')}>
                                <div className={cx('input-box')}>
                                    <input
                                        spellCheck={false}
                                        placeholder="User name..."
                                        onChange={(e) => setUserName(e.target.value)}
                                    />
                                    <span className={cx('input-label')}>User name*</span>
                                </div>

                                <div className={cx('input-box')}>
                                    <input
                                        spellCheck={false}
                                        placeholder="Password..."
                                        onChange={(e) => setPassword(e.target.value)}
                                        type="password"
                                    />
                                    <span className={cx('input-label')}>Password*</span>
                                </div>
                            </div>
                        </div>

                        <div className={cx('footer')}>
                            <Button className={cx('submit-btn')} title="Log in" onClick={handleSubmit} primary />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LogIn;
