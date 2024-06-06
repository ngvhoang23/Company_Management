import classNames from 'classnames/bind';
import styles from './CalendarRequestEditor.module.scss';
import PageHeader from '../components/PageHeader/PageHeader';

import { useState } from 'react';
import Datetime from 'react-datetime';

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const cx = classNames.bind(styles);

function CalendarRequestEditor() {
    const user = JSON.parse(localStorage.getItem('USER_INFO'));

    const navigate = useNavigate();

    const { calId } = useParams();

    const [calData, setCalData] = useState({ room: '', content: '' });

    useEffect(() => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/calendars/requests/${calId}`,
            params: {
                user,
                cal_req_id: calId,
            },
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
            url: `http://localhost:5000/calendars/requests/${calId}`,
            params: {
                user,
            },
            data: {
                ...calData,
                start_date: moment(calData.start_date).format(),
                end_date: moment(calData.end_date).format(),
                cal_id: calId,
            },
        };
        axios(configuration)
            .then((result) => {
                navigate(`/calendars/sent-requests`, { replace: true });
            })
            .catch((error) => {
                error = new Error();
            });
    };

    return (
        <div className={cx('wrapper')}>
            <PageHeader title="Edit Calendar Request" />
            <div className={cx('container')}>
                <div className={cx('input-box')}>
                    <span className={cx('input-label')}>Room*</span>
                    <input
                        value={calData.room || ''}
                        placeholder="Room*"
                        onChange={(e) =>
                            setCalData((prev) => {
                                return { ...prev, room: e.target.value };
                            })
                        }
                    />
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
                    <button className={cx('submit-btn')} onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CalendarRequestEditor;
