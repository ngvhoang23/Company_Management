import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import PageHeader from '../components/PageHeader/PageHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import DetailInfo from './components/DetailInfo/DetailInfo';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import MediaItem2 from '~/components/MediaItem2/MediaItem2';
import { useFetcher, useNavigate, useParams } from 'react-router-dom';
import { UserInfoContext } from '~/Context/UserInfoContext';
import Cookies from 'universal-cookie';
import Button from '~/components/Button/Button';
import { PopUpContext } from '~/Context/PopUpContext';
import { IsFetchProfileContext } from '~/Context/IsFetchProfileContext';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function Profile() {
    const userInfoContext = useContext(UserInfoContext);
    const userInfo = userInfoContext.userInfo;
    const setUserInfo = userInfoContext.setUserInfo;

    const popUpContext = useContext(PopUpContext);
    const popUp = popUpContext.popUp;
    const setPopUp = popUpContext.setPopUp;

    const navigate = useNavigate();

    const [userData, setUserData] = useState({});

    const { user_id } = useParams();

    useEffect(() => {
        const u_id = user_id || userInfo?.emp_id;

        const configuration = {
            method: 'get',
            url: `http://localhost:5000/employees/${u_id}`,
            params: { emp_id: u_id },
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        u_id &&
            axios(configuration)
                .then((result) => {
                    setUserData(result.data);
                })
                .catch((error) => {
                    error = new Error();
                    console.log(error);
                });
    }, [userInfo?.emp_id, user_id]);

    const handleOpenPopupChangePassword = () => {
        setPopUp({ emp_id: -1 });
    };

    const handleEditProfile = () => {
        if (user_id) {
            navigate(`/employees/edit-employee/${user_id}`);
        } else {
            navigate(`/profile/edit-profile`);
        }
    };

    const {
        degree,
        citizen_identification,
        emp_name,
        role,
        avatar,
        address,
        phone_num,
        email,
        about,
        education,
        experience,
        salary,
    } = userData;

    return (
        <div
            className={cx('wrapper')}
            style={{ backgroundImage: `url(${require('../../assets/images/post_bg2.jpg')})` }}
        >
            <div className={cx('contact-box')}>
                <div className={cx('edit-btn')} onClick={() => handleEditProfile()}>
                    <img
                        style={{ height: '32px', width: '32px' }}
                        src={require('../../assets/images/edit_user_icon.png')}
                    />
                    <p>Edit Profile</p>
                </div>
                <div className={cx('role')}>
                    {role == 'Director' ? (
                        <>
                            <img
                                style={{ height: '22px', width: '22px' }}
                                src={require('../../assets/images/star_icon.png')}
                            />
                            <p>Director</p>
                        </>
                    ) : (
                        <>
                            <img
                                style={{ height: '22px', width: '22px' }}
                                src={require('../../assets/images/emp_icon.png')}
                            />
                            <p>Staff</p>
                        </>
                    )}
                </div>
                <div className={cx('user-avatar')}>
                    <MediaItem2
                        item={{ url: avatar, type: 'image' }}
                        width={112}
                        height={112}
                        border_radius={1000}
                        _styles={{
                            boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                        }}
                    />
                </div>
                <div className={cx('contact-content')}>
                    <div className={cx('email')}>
                        <img
                            style={{ height: '32px', width: '32px' }}
                            src={require('../../assets/images/id_icon.png')}
                        />
                        <p>{citizen_identification}</p>
                    </div>

                    <div className={cx('email')}>
                        <img
                            style={{ height: '32px', width: '32px' }}
                            src={require('../../assets/images/degree_icon.png')}
                        />
                        <p>{degree}</p>
                    </div>

                    <div className={cx('phone-number')}>
                        <img
                            style={{ height: '32px', width: '32px' }}
                            src={require('../../assets/images/phone_icon.png')}
                        />
                        <p>{phone_num}</p>
                    </div>
                    <div className={cx('email')}>
                        <img
                            style={{ height: '32px', width: '32px' }}
                            src={require('../../assets/images/gmail_icon.png')}
                        />
                        <p>{email}</p>
                    </div>

                    <div className={cx('address')}>
                        <img
                            style={{ height: '32px', width: '32px' }}
                            src={require('../../assets/images/address_icon.png')}
                        />
                        <p>{address}</p>
                    </div>

                    <div className={cx('salary')}>
                        <img
                            style={{ height: '32px', width: '32px' }}
                            src={require('../../assets/images/salary_icon.png')}
                        />
                        <p>{salary} $</p>
                    </div>

                    <Button
                        className={cx('change-password-btn')}
                        title="Change Password"
                        onClick={() => handleOpenPopupChangePassword()}
                        icon={
                            <img
                                style={{ height: '24px', width: '24px' }}
                                src={require('../../assets/images/key_icon.png')}
                            />
                        }
                    />
                </div>
            </div>
            <div className={cx('detail-info')}>
                <DetailInfo about={about} education={education} experience={experience} />
            </div>
        </div>
    );
}

export default Profile;
