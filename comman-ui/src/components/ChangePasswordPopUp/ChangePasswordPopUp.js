import classNames from 'classnames/bind';
import styles from './ChangePasswordPopUp.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button/Button';
import { PopUpContext } from '~/Context/PopUpContext';
import { useContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { ResultStatusContext } from '~/Context/ResultStatusContext';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function ChangePasswordPopUp() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const navigate = useNavigate();

    const popUpContext = useContext(PopUpContext);
    const popUp = popUpContext.popUp;
    const setPopUp = popUpContext.setPopUp;

    const resultStatusContext = useContext(ResultStatusContext);
    const resultStatus = resultStatusContext.status;
    const setResultStatus = resultStatusContext.setStatus;

    const handleChangePassword = (new_password, old_password) => {
        const configuration = {
            method: 'post',
            url: `http://localhost:5000/employees/change-password`,
            data: {
                new_password: new_password,
                old_password: old_password,
            },
            headers: {
                Authorization: `Bearer ${cookies.get('access_token')}`,
            },
        };

        axios(configuration)
            .then((result) => {
                setResultStatus({ status: 1, message: 'Success' });
                setPopUp();
            })
            .catch((error) => {
                if (error?.response?.data == 'Wrong Password') {
                    setResultStatus({ status: 0, message: 'Wrong Password!' });
                } else {
                    setResultStatus({ status: 0, message: 'Fail!' });
                }
                console.log(error);
                error = new Error();
            });
    };

    return (
        <div
            className={cx('wrapper')}
            onClick={() => {
                setPopUp();
            }}
        >
            <div
                className={cx('container')}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className={cx('header')}>
                    <div className={cx('title')}>
                        <img
                            style={{ height: '40px', width: '40px', marginRight: '8px' }}
                            src={require('~/assets/images/key_icon.png')}
                        />
                        <p>{'Change Password'}</p>
                    </div>
                    <button
                        className={cx('close-btn')}
                        onClick={() => {
                            setPopUp();
                        }}
                    >
                        <FontAwesomeIcon className={cx('close-icon')} icon={faXmark} />
                    </button>
                </div>
                <div className={cx('body')}>
                    <div className={cx('input-box')}>
                        <input
                            value={oldPassword}
                            placeholder={'Old Password'}
                            onChange={(e) => {
                                setOldPassword(e.target.value);
                            }}
                        />
                        <span className={cx('input-label')}>{'Old Password'}</span>
                    </div>
                    <div className={cx('input-box')}>
                        <input
                            value={newPassword}
                            placeholder={'New Password'}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                            }}
                        />
                        <span className={cx('input-label')}>{'New Password'}</span>
                    </div>
                </div>
                <div className={cx('footer')}>
                    <Button
                        className={cx('approve-btn')}
                        title="Confirm"
                        onClick={() => handleChangePassword(newPassword, oldPassword)}
                        primary
                    />

                    <Button
                        className={cx('reject-btn')}
                        title="Cancel"
                        onClick={() => {
                            setPopUp();
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordPopUp;
