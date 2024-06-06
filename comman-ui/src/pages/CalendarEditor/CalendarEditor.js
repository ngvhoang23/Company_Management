import classNames from 'classnames/bind';
import styles from './CalendarEditor.module.scss';
import PageHeader from '../components/PageHeader/PageHeader';

import { useState } from 'react';
import Datetime from 'react-datetime';

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import ConfirmBox from '~/components/ConfirmBox/ConfirmBox';
import Button from '~/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'universal-cookie';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function CalendarEditor() {
    const navigate = useNavigate();

    const { calId } = useParams();

    const [calData, setCalData] = useState({ room: '', content: '' });
    const [isShowConfirmBox, setIsShowConfirmBox] = useState(false);

    useEffect(() => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/calendars/${calId}`,
            params: {
                cal_id: calId,
            },
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        axios(configuration)
            .then((result) => {
                setCalData(result.data[0]);
            })
            .catch((error) => {
                error = new Error();
            });
    }, [calId]);

    const handleSubmit = () => {
        const configuration = {
            method: 'put',
            url: `http://localhost:5000/calendars/${calId}`,
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
            data: {
                ...calData,
                start_date: moment(calData.start_date).format(),
                end_date: moment(calData.end_dat).format(),
                cal_id: calId,
            },
        };
        axios(configuration)
            .then((result) => {
                navigate('/calendars', { replace: true });
            })
            .catch((error) => {
                error = new Error();
            });
    };

    const handleDelete = () => {
        const configuration = {
            method: 'delete',
            url: `http://localhost:5000/calendars/${calId}`,
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
            data: {
                cal_id: calId,
            },
        };

        axios(configuration)
            .then((result) => {
                navigate('/calendars', { replace: true });
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
                    title="Edit Calendar"
                    icon={
                        <img
                            style={{ height: '54px', width: '54px' }}
                            src={require('../../assets/images/edit_calendar_icon.png')}
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
                            <span className={cx('input-label')}>Start Date*</span>
                            <Datetime
                                value={moment(calData.start_date)}
                                onChange={(value) =>
                                    setCalData((prev) => {
                                        return { ...prev, start_date: value.format() };
                                    })
                                }
                            />
                        </div>

                        <div className={cx('end-time-picker')}>
                            <span className={cx('input-label')}>End Date*</span>
                            <Datetime
                                value={moment(calData.end_date)}
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
                            rows={5}
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
                        <Button
                            className={cx('delete-btn')}
                            title="Delete"
                            onClick={() => setIsShowConfirmBox(2)}
                            icon={<FontAwesomeIcon icon={faXmark} />}
                        />
                    </div>
                </div>
            </div>
            {isShowConfirmBox && (
                <ConfirmBox
                    content={
                        isShowConfirmBox == 1
                            ? 'Do you really want to edit this calendar?'
                            : 'Do you really want to delete this calendar?'
                    }
                    onAprrove={() => {
                        setIsShowConfirmBox(false);
                        if (isShowConfirmBox == 1) {
                            handleSubmit();
                        } else {
                            handleDelete();
                        }
                    }}
                    onReject={() => {
                        setIsShowConfirmBox(false);
                    }}
                />
            )}
        </>
    );
}

export default CalendarEditor;
