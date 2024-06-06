import classNames from 'classnames/bind';
import styles from './RequestEditor.module.scss';
import PageHeader from '../components/PageHeader/PageHeader';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import ConfirmBox from '~/components/ConfirmBox/ConfirmBox';

const cx = classNames.bind(styles);

function RequestEditor() {
    const user = JSON.parse(localStorage.getItem('USER_INFO'));

    const navigate = useNavigate();

    const { reqId } = useParams();

    const [isShowDestinationMenu, setIsShowDestinationMenu] = useState(false);
    const [isShowTypeReqMenu, setIsShowTypeReqMenu] = useState(false);

    const [managers, setManagers] = useState([]);

    const [reqData, setReqData] = useState();
    const [isShowConfirmBox, setIsShowConfirmBox] = useState(false);

    useEffect(() => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/employees/managers`,
            params: { user },
        };
        reqId &&
            axios(configuration)
                .then((result) => {
                    setManagers(result.data);
                })
                .catch((error) => {
                    error = new Error();
                });
    }, []);

    useEffect(() => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/requests/${reqId}`,
            params: {
                user,
                req_id: reqId,
            },
        };
        reqId &&
            axios(configuration)
                .then((result) => {
                    setReqData(result.data[0]);
                })
                .catch((error) => {
                    error = new Error();
                });
    }, []);

    const handleSubmit = () => {
        const configuration = {
            method: 'put',
            url: `http://localhost:5000/requests/${reqId}`,
            data: reqData,
            params: {
                user,
            },
        };
        reqId &&
            axios(configuration)
                .then((result) => {
                    navigate('/requests/sent-requests', { replace: true });
                })
                .catch((error) => {
                    error = new Error();
                });
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <PageHeader title="Edit Request" />
                <div className={cx('container')}>
                    <div className={cx('input-container')}>
                        <div className={cx('drop-input')}>
                            <div className={cx('drop-down-menu')}>
                                <div
                                    className={cx('drop-down-header')}
                                    onClick={() => setIsShowDestinationMenu((prev) => !prev)}
                                >
                                    <span>{reqData?.receiver_name}</span>
                                    <FontAwesomeIcon className={cx('drop-icon')} icon={faChevronDown} />
                                </div>
                                {isShowDestinationMenu && (
                                    <ul className={cx('item-list')} onClick={() => setIsShowDestinationMenu(false)}>
                                        {managers.map((manager) => (
                                            <li
                                                key={manager.emp_id}
                                                onClick={() =>
                                                    setReqData((prev) => {
                                                        return {
                                                            ...prev,
                                                            receiver_id: manager.emp_id,
                                                            receiver_name: manager.emp_name,
                                                            dep_name: manager.dep_name,
                                                            receiver_role: manager.role,
                                                        };
                                                    })
                                                }
                                            >
                                                {manager.emp_name} - {manager.dep_name} - {manager.role}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className={cx('drop-down-menu')}>
                                <div
                                    className={cx('drop-down-header')}
                                    onClick={() => setIsShowTypeReqMenu((prev) => !prev)}
                                >
                                    <span>{reqData?.req_type}</span>
                                    <FontAwesomeIcon className={cx('drop-icon')} icon={faChevronDown} />
                                </div>
                                {isShowTypeReqMenu && (
                                    <ul className={cx('item-list')} onClick={() => setIsShowTypeReqMenu(false)}>
                                        <li
                                            onClick={() => {
                                                setReqData((prev) => {
                                                    return { ...prev, req_type: 'Nghỉ Phép Ngẫu Nhiên' };
                                                });
                                            }}
                                        >
                                            Nghỉ Phép Ngẫu Nhiên
                                        </li>
                                        <li
                                            onClick={() => {
                                                setReqData((prev) => {
                                                    return { ...prev, req_type: 'Yêu Cầu Xét Duyệt Chi' };
                                                });
                                            }}
                                        >
                                            Yêu Cầu Xét Duyệt Chi
                                        </li>
                                        <li
                                            onClick={() => {
                                                setReqData((prev) => {
                                                    return { ...prev, req_type: 'Gia Hạn Deadline' };
                                                });
                                            }}
                                        >
                                            Gia Hạn Deadline
                                        </li>

                                        <li
                                            onClick={() => {
                                                setReqData((prev) => {
                                                    return { ...prev, req_type: 'Khác' };
                                                });
                                            }}
                                        >
                                            Khác
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className={cx('content-input')}>
                            <ReactQuill
                                theme="snow"
                                value={reqData?.content || ''}
                                onChange={(e) => {
                                    setReqData((prev) => {
                                        return { ...prev, content: e };
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className={cx('footer')}>
                        <button
                            className={cx('submit-btn')}
                            onClick={() => {
                                setIsShowConfirmBox(true);
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>

            {isShowConfirmBox && (
                <ConfirmBox
                    content={'Do you really want to edit this request?'}
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

export default RequestEditor;
