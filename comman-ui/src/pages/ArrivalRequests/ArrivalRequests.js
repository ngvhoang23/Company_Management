import classNames from 'classnames/bind';
import styles from './ArrivalRequests.module.scss';
import PageHeader from '../components/PageHeader/PageHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCircle, faCircleXmark, faPlus, faRotateRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import EmployeeItem from '../Employees/EmployeeItem';
import PopperWrapper from '~/components/PopperWrapper/PopperWrapper';
import RequestItem from './RequestItem';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Popper from '~/components/Popper/Popper';
import Cookies from 'universal-cookie';
import { UserInfoContext } from '~/Context/UserInfoContext';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function ArrivalRequests() {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [isShowDetail, setIsShowDetail] = useState(false);
    const [chosenReq, setChosenReq] = useState({});

    const userInfoContext = useContext(UserInfoContext);
    const userInfo = userInfoContext.userInfo;
    const setUserInfo = userInfoContext.setUserInfo;

    const fetchRequests = () => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/requests/received-requests`,
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        axios(configuration)
            .then((result) => {
                setRequests(result.data);
            })
            .catch((error) => {
                error = new Error();
            });
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleSubmit = (req_id, status) => {
        const configuration = {
            method: 'put',
            url: `http://localhost:5000/requests/status/${req_id}`,
            params: {
                req_id,
                status,
            },
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        axios(configuration)
            .then((result) => {
                fetchRequests();
            })
            .catch((error) => {
                error = new Error();
            });
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div
            className={cx('wrapper')}
            style={{ backgroundImage: `url(${require('../../assets/images/post_bg2.jpg')})` }}
        >
            <PageHeader
                title="Arrival Requests"
                icon={
                    <img
                        style={{ height: '54px', width: '54px' }}
                        src={require('../../assets/images/request_icon2.png')}
                    />
                }
            />
            <div className={cx('container')}>
                <PopperWrapper
                    title="All ArrivalRequests"
                    fields={[
                        { name: 'Image', ratio: 3 },
                        { name: 'Name', ratio: 5 },
                        { name: 'Request Type', ratio: 5 },
                        { name: 'Status', ratio: 3 },
                        { name: 'Created At', ratio: 10 },
                        { name: 'Content', ratio: 10 },
                        { name: 'Actions', ratio: 3 },
                    ]}
                    icon={
                        <img
                            style={{ height: '30px', width: '30px', marginRight: '8px' }}
                            src={require('../../assets/images/request_icon.png')}
                        />
                    }
                >
                    {requests.map((request) => (
                        <RequestItem
                            key={request.req_id}
                            className={'border-top'}
                            request={request}
                            action={
                                <div>
                                    {request.status !== 1 && (
                                        <button
                                            className={cx('action-btn', 'approve-btn')}
                                            onClick={() => handleSubmit(request.req_id, 1)}
                                        >
                                            <FontAwesomeIcon icon={faCheck} />
                                        </button>
                                    )}

                                    {request.status !== 2 && (
                                        <button
                                            className={cx('action-btn', 'refuse-btn')}
                                            onClick={() => handleSubmit(request.req_id, 2)}
                                        >
                                            <FontAwesomeIcon icon={faCircleXmark} />
                                        </button>
                                    )}
                                </div>
                            }
                            onClick={() => {
                                setChosenReq(request);
                                setIsShowDetail(true);
                            }}
                        />
                    ))}
                </PopperWrapper>
            </div>
            <Popper isVisible={isShowDetail} setIsVisible={setIsShowDetail}>
                <div className={cx('popper-wrapper')}>
                    <div className={cx('header')}>
                        <div className={cx('owner-info')}>
                            <img src={chosenReq.avatar} alt="" />
                            <div>
                                <span className={cx('owner-name')}>{chosenReq.emp_name}</span>
                                <span className={cx('dep-name')}>DEVELOPING</span>
                            </div>
                        </div>
                        <button className={cx('close-btn')} onClick={() => setIsShowDetail(false)}>
                            <FontAwesomeIcon className={cx('close-icon')} icon={faXmark} />
                        </button>
                    </div>
                    <div className={cx('body')}>
                        <div className={cx('info-item')}>
                            <span>Request Type: </span>
                            <p className={cx('item-content')}>{chosenReq.req_type}</p>
                        </div>

                        <div className={cx('info-item')}>
                            <span>Created At: </span>
                            <p className={cx('item-content')}>{formatDate(chosenReq.created_at)}</p>
                        </div>

                        <div className={cx('info-item')}>
                            <span>Status: </span>
                            {chosenReq.status === 0 && <p className={cx('item-content')}>Pending</p>}
                            {chosenReq.status === 1 && <p className={cx('item-content', 'approved')}>Approved</p>}
                            {chosenReq.status === 2 && <p className={cx('item-content', 'rejected')}>Rejected</p>}
                        </div>

                        <div className={cx('info-item')}>
                            <span>Content: </span>
                            <p
                                className={cx('item-content', 'content')}
                                dangerouslySetInnerHTML={{ __html: chosenReq.content }}
                            ></p>
                        </div>
                    </div>
                </div>
            </Popper>
        </div>
    );
}

export default ArrivalRequests;
