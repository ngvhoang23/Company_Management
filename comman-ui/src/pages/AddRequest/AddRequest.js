import classNames from 'classnames/bind';
import styles from './AddRequest.module.scss';
import PageHeader from '~/pages/components/PageHeader/PageHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import ConfirmBox from '~/components/ConfirmBox/ConfirmBox';
import Button from '~/components/Button/Button';
import './quill.css';

const cx = classNames.bind(styles);

function AddRequest() {
    const user = JSON.parse(localStorage.getItem('USER_INFO'));

    const navigate = useNavigate();

    const [isShowDestinationMenu, setIsShowDestinationMenu] = useState(false);
    const [isShowTypeReqMenu, setIsShowTypeReqMenu] = useState(false);
    const [isShowConfirmBox, setIsShowConfirmBox] = useState(false);

    const [reqData, setReqData] = useState({
        creator_id: user?.emp_id,
        receiver_id: 0,
        req_type: 'Nghỉ Phép Ngẫu Nhiên',
        content: '',
        created_at: moment(new Date()).format(),
    });

    const [managers, setManagers] = useState([]);

    useEffect(() => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/employees/managers`,
            params: {
                user,
            },
        };
        axios(configuration)
            .then((result) => {
                setManagers(result.data);
                setReqData((prev) => {
                    return {
                        ...prev,
                        receiver_id: result.data[0].emp_id,
                        receiver_name: result.data[0].emp_name,
                        receiver_role: result.data[0].role,
                        dep_name: result.data[0].dep_name,
                    };
                });
            })
            .catch((error) => {
                error = new Error();
            });
    }, []);

    const handleSubmit = () => {
        if (!(reqData.content && reqData.creator_id && reqData.receiver_id && reqData.req_type)) {
            alert('You must fill in all the required fields.');
            return;
        }

        const configuration = {
            method: 'post',
            url: `http://localhost:5000/requests`,
            data: reqData,
            params: {
                user,
            },
        };
        axios(configuration)
            .then((result) => {
                navigate('/requests/sent-requests', { replace: true });
            })
            .catch((error) => {
                error = new Error();
            });
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            ['link', 'image'],
            ['clean'],
        ],
    };

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
    ];

    return (
        <>
            <div
                className={cx('wrapper')}
                style={{ backgroundImage: `url(${require('../../assets/images/post_bg2.jpg')})` }}
            >
                <PageHeader
                    title="Add Request"
                    icon={
                        <img
                            style={{ height: '54px', width: '54px' }}
                            src={require('../../assets/images/request_icon2.png')}
                        />
                    }
                />
                <div className={cx('container')}>
                    <div className={cx('input-container')}>
                        <div className={cx('drop-input')}>
                            <div className={cx('drop-down-menu')}>
                                <div
                                    className={cx('drop-down-header')}
                                    onClick={() => setIsShowDestinationMenu((prev) => !prev)}
                                >
                                    <span>
                                        {`${reqData?.receiver_name} - ${reqData?.dep_name ? reqData?.dep_name : ''} - ${
                                            reqData?.receiver_role
                                        }`}
                                    </span>
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
                                value={reqData.content || ''}
                                onChange={(e) => {
                                    setReqData((prev) => {
                                        return { ...prev, content: e };
                                    });
                                }}
                                className={'quill-container'}
                                modules={modules}
                                formats={formats}
                            />
                        </div>
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
                    content={'Do you really want to add this request?'}
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

export default AddRequest;
