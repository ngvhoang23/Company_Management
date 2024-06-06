import classNames from 'classnames/bind';
import styles from './AddCalendar.module.scss';
import PageHeader from '../components/PageHeader/PageHeader';
import { useContext, useState } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import ConfirmBox from '~/components/ConfirmBox/ConfirmBox';
import Button from '~/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'universal-cookie';
import { UserInfoContext } from '~/Context/UserInfoContext';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function AddCalendar() {
    const userInfoContext = useContext(UserInfoContext);
    const userInfo = userInfoContext.userInfo;
    const setUserInfo = userInfoContext.setUserInfo;

    const navigate = useNavigate();

    const [calData, setCalData] = useState({
        room: '',
        start_date: moment(new Date()).format(),
        end_date: moment(new Date()).format(),
        created_at: moment(new Date()).format(),
        content: '',
        creator_id: userInfo.emp_id,
        dep_id: userInfo.dep_id,
    });

    const [isShowConfirmBox, setIsShowConfirmBox] = useState(false);

    const handleSubmit = () => {
        if (!(calData.room && calData.content)) {
            alert('You must fill in all the required fields.');
            return;
        }

        let configuration = {};

        if (userInfo.role === 'Director') {
            configuration = {
                method: 'post',
                url: 'http://localhost:5000/calendars',
                headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
                data: { ...calData },
            };
        }

        if (userInfo.role === 'Manager') {
            configuration = {
                method: 'post',
                url: 'http://localhost:5000/calendars/requests',
                headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
                data: { ...calData },
            };
        }

        axios(configuration)
            .then((result) => {
                if (userInfo.role === 'Director') {
                    navigate('/calendars', { replace: true });
                } else {
                    navigate('/calendars/sent-requests', { replace: true });
                }
            })
            .catch((error) => {
                error = new Error();
            });
    };

    return (
        <>
            <div
                className={cx('wrapper')}
                style={{ backgroundImage: `url(${require('../../assets/images/post_bg2.jpg')})` }}
            >
                <PageHeader
                    title="Add Calendar"
                    icon={
                        <img
                            style={{ height: '54px', width: '54px' }}
                            src={require('../../assets/images/calendar_plus_icon.png')}
                        />
                    }
                />
                <div className={cx('container')}>
                    <div className={cx('input-box')}>
                        <input
                            value={calData.room}
                            placeholder="Room*"
                            onChange={(e) =>
                                setCalData((prev) => {
                                    return { ...prev, room: e.target.value };
                                })
                            }
                        />
                        <span className={cx('input-label')}>Room*</span>
                    </div>
                    <div className={cx('date-time-picker')}>
                        <div className={cx('start-time-picker')}>
                            <span className={cx('input-label')}>Start*</span>
                            <Datetime
                                initialValue={new Date()}
                                onChange={(value) =>
                                    setCalData((prev) => {
                                        return { ...prev, start_date: value.format() };
                                    })
                                }
                            />
                        </div>

                        <div className={cx('end-time-picker')}>
                            <span className={cx('input-label')}>End*</span>
                            <Datetime
                                initialValue={new Date()}
                                onChange={(value) =>
                                    setCalData((prev) => {
                                        return { ...prev, end_date: value.format() };
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div className={cx('calendar-content')}>
                        <textarea
                            value={calData.content}
                            rows={4}
                            className={cx('content-input')}
                            placeholder="Content*"
                            onChange={(e) =>
                                setCalData((prev) => {
                                    return { ...prev, content: e.target.value };
                                })
                            }
                        />
                    </div>

                    <div className={cx('footer')}>
                        <Button
                            className={cx('submit-btn')}
                            title="Submit"
                            onClick={() => setIsShowConfirmBox(true)}
                            primary
                            icon={<FontAwesomeIcon icon={faPaperPlane} />}
                        />
                    </div>
                </div>
            </div>

            {isShowConfirmBox && (
                <ConfirmBox
                    content={'Do you really want to add this calendar?'}
                    onAprrove={() => {
                        setIsShowConfirmBox(false);
                        handleSubmit();
                    }}
                    onReject={() => {
                        setIsShowConfirmBox(false);
                    }}
                />
            )}
        </>
    );
}

export default AddCalendar;
