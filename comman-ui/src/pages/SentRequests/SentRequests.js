import classNames from 'classnames/bind';
import styles from './SentRequests.module.scss';
import PageHeader from '../components/PageHeader/PageHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faRotateRight, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import EmployeeItem from '../Employees/EmployeeItem';
import PopperWrapper from '~/components/PopperWrapper/PopperWrapper';
import RequestItem from './RequestItem';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Popper from '~/components/Popper/Popper';
import ConfirmBox from '~/components/ConfirmBox/ConfirmBox';

const cx = classNames.bind(styles);

function SentRequests() {
    const user = JSON.parse(localStorage.getItem('USER_INFO'));
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [isShowDetail, setIsShowDetail] = useState(false);
    const [chosenReq, setChosenReq] = useState({});
    const [isShowConfirmBox, setIsShowConfirmBox] = useState(false);

    const fetchRequests = () => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/requests/sent-requests`,
            params: {
                user,
            },
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

    const handleDeleteReq = (req_id) => {
        const configuration = {
            method: 'delete',
            url: `http://localhost:5000/requests/${req_id}`,
            params: {
                user,
            },
            data: {
                req_id,
            },
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
        <>
            <div
                className={cx('wrapper')}
                style={{ backgroundImage: `url(${require('../../assets/images/post_bg2.jpg')})` }}
            >
                <PageHeader
                    title="Sent Requests"
                    icon={
                        <img
                            style={{ height: '54px', width: '54px' }}
                            src={require('../../assets/images/request_icon.png')}
                        />
                    }
                />
                <div className={cx('container')}>
                    <PopperWrapper
                        title="All SentRequests"
                        fields={[
                            { name: 'Image', ratio: 3 },
                            { name: 'Name', ratio: 5 },
                            { name: 'Request Type', ratio: 5 },
                            { name: 'Status', ratio: 3 },
                            { name: 'Created At', ratio: 10 },
                            { name: 'Content', ratio: 10 },
                            { name: 'Actions', ratio: 3 },
                        ]}
                        onAddNew={() => {
                            navigate(`/requests/add-request/`, { replace: true });
                        }}
                        onReload={() => fetchRequests()}
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
                                    <>
                                        {request.status === 0 && (
                                            <>
                                                <button
                                                    className={cx('action-btn', 'edit-btn')}
                                                    onClick={() => {
                                                        navigate(`/requests/edit-request/${request.req_id}`, {
                                                            replace: true,
                                                        });
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                </button>

                                                <button
                                                    className={cx('action-btn', 'remove-btn')}
                                                    onClick={() => {
                                                        setIsShowConfirmBox(request.req_id);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </button>
                                            </>
                                        )}
                                    </>
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
                                <span>Request Type</span>
                                <p className={cx('item-content')}>{chosenReq.req_type}</p>
                            </div>

                            <div className={cx('info-item')}>
                                <span>Created At</span>
                                <p className={cx('item-content')}>{formatDate(chosenReq.created_at)}</p>
                            </div>

                            <div className={cx('info-item')}>
                                <span>Status</span>
                                {chosenReq.status === 0 && <p className={cx('item-content')}>Pending</p>}
                                {chosenReq.status === 1 && <p className={cx('item-content')}>Approved</p>}
                                {chosenReq.status === 2 && <p className={cx('item-content')}>Reject</p>}
                            </div>

                            <div className={cx('info-item')}>
                                <span>Content</span>
                                <p
                                    className={cx('item-content', 'content')}
                                    dangerouslySetInnerHTML={{ __html: chosenReq.content }}
                                ></p>
                            </div>
                        </div>
                    </div>
                </Popper>
            </div>
            {isShowConfirmBox && (
                <ConfirmBox
                    content={'Do you really want to delete this request?'}
                    onAprrove={() => {
                        setIsShowConfirmBox(false);
                        handleDeleteReq(isShowConfirmBox);
                    }}
                    onReject={() => {
                        setIsShowConfirmBox(false);
                    }}
                />
            )}
        </>
    );
}

export default SentRequests;
