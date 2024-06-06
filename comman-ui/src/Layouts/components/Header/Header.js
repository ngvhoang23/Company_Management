import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { UserInfoContext } from '~/Context/UserInfoContext';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function Header() {
    const userInfoContext = useContext(UserInfoContext);
    const userInfo = userInfoContext.userInfo;

    const navigate = useNavigate();

    const checkSameDay = (day1, day2) => {
        return day1.getMonth() === day2.getMonth() && day1.getDate() === day2.getDate();
    };

    return (
        <div className={cx('wrapper')}>
            {checkSameDay(new Date(userInfo?.birth_date), new Date()) && (
                <marquee className={cx('congratulation-text')}>
                    {`Happy Birthday ${userInfo.emp_name}. I hope your celebration gives you many happy memories! 🎉 🎉 🎉`}
                </marquee>
            )}
            <div className={cx('user-container')} onClick={() => navigate('/profile')}>
                {userInfo.role == 'Director' ? (
                    <div className={cx('role-icon')}>
                        <img src={require('../../../assets/images/star_icon.png')} />
                    </div>
                ) : (
                    <div className={cx('role-icon')}>
                        <img src={require('../../../assets/images/emp_icon.png')} />
                    </div>
                )}
                <marquee className={cx('user-name')}>
                    <p>{userInfo.emp_name}</p>
                </marquee>
                <img className={cx('user-img')} src={userInfo.avatar} alt="user-img" />
            </div>
        </div>
    );
}

export default Header;
