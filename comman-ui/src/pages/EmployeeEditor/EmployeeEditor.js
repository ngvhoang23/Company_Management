import classNames from 'classnames/bind';
import styles from './EmployeeEditor.module.scss';
import PageHeader from '../components/PageHeader/PageHeader';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Datetime from 'react-datetime';
import moment from 'moment';
import ConfirmBox from '~/components/ConfirmBox/ConfirmBox';
import Button from '~/components/Button/Button';
import { UserInfoContext } from '~/Context/UserInfoContext';
import Cookies from 'universal-cookie';
import { PopUpContext } from '~/Context/PopUpContext';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function EmployeeEditor() {
    const userInfoContext = useContext(UserInfoContext);
    const userInfo = userInfoContext.userInfo;
    const setUserInfo = userInfoContext.setUserInfo;

    const popUpContext = useContext(PopUpContext);
    const popUp = popUpContext.popUp;
    const setPopUp = popUpContext.setPopUp;

    const { empId } = useParams();
    const navigate = useNavigate();

    const avatarinpRef = useRef();

    const [userData, setUserData] = useState({});

    const [dropDownMenu, setDropDownMenu] = useState();
    const [isShowConfirmBox, setIsShowConfirmBox] = useState(false);

    const [departments, setDepartments] = useState([]);

    const user_role = useRef('');

    useEffect(() => {
        const configuration = {
            method: 'get',
            url: 'http://localhost:5000/departments',
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        axios(configuration)
            .then((result) => {
                setDepartments(result.data);
                let ind = result.data.findIndex((dep) => {
                    return dep.dep_id === userInfo?.dep_id;
                });
                if (ind === -1) {
                    ind = 0;
                }
                setUserData((prev) => {
                    return {
                        ...prev,
                        dep_id: result.data[ind].dep_id,
                        dep_name: result.data[ind].dep_name,
                    };
                });
            })
            .catch((error) => {
                error = new Error();
            });
    }, []);

    useEffect(() => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/employees/${empId}`,
            params: {
                emp_id: empId,
            },
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        empId &&
            axios(configuration)
                .then((result) => {
                    result.data.birth_date = moment(result.data.birth_date).format();
                    result.data.joining_date = moment(result.data.joining_date).format();
                    user_role.current = result.data.role;
                    setUserData(result.data);
                })
                .catch((error) => {
                    error = new Error();
                });
    }, [empId]);

    const handleSubmit = () => {
        if (!(userData.citizen_identification && userData.emp_name && userData.password && empId)) {
            alert('You must fill in all the required fields.!');
            return;
        }
        const formData = new FormData();

        formData.append('userData', JSON.stringify(userData));
        userData.user_avatar && formData.append('userAvatar', userData.user_avatar);

        const config = {
            headers: {
                ['content-type']: 'multipart/form-data',
                Authorization: `Bearer ${cookies.get('access_token')}`,
            },
        };

        axios
            .put(`http://localhost:5000/employees/${userData.emp_id}`, formData, config)
            .then((result) => {
                navigate('/employees', { replace: true });
            })
            .catch((error) => {
                if ((error.response.data.code = 'ER_DUP_ENTRY')) {
                    alert('User name is exist :(');
                }
                error = new Error();
            });
    };

    const handleOpenPopupChangePassword = () => {
        setPopUp({ emp_id: empId });
    };

    return (
        <>
            <div
                className={cx('wrapper')}
                onClick={() => setDropDownMenu()}
                style={{ backgroundImage: `url(${require('../../assets/images/post_bg2.jpg')})` }}
            >
                <PageHeader
                    title="Edit Employee"
                    icon={
                        <img
                            style={{ height: '54px', width: '54px' }}
                            src={require('../../assets/images/edit_user_icon.png')}
                        />
                    }
                />
                <div className={cx('container')}>
                    <div className={cx('input-container')}>
                        <div className={cx('input-box')}>
                            <input
                                spellCheck={false}
                                value={userData.citizen_identification || ''}
                                placeholder="Employee ID*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, citizen_identification: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Employee ID*</span>
                        </div>

                        <div className={cx('input-box')}>
                            <input
                                spellCheck={false}
                                value={userData.phone_num || ''}
                                placeholder="Mobile*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, phone_num: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Mobile*</span>
                        </div>

                        <div className={cx('input-box')}>
                            <input
                                spellCheck={false}
                                value={userData.emp_name || ''}
                                placeholder="Full name*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, emp_name: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Full name*</span>
                        </div>

                        <div className={cx('drop-down-menu', 'input-box')}>
                            <span className={cx('input-label')}>Sex*</span>
                            <div
                                className={cx('drop-down-header')}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDropDownMenu((prev) => {
                                        if (prev == 'sex') {
                                            return undefined;
                                        } else {
                                            return 'sex';
                                        }
                                    });
                                }}
                            >
                                <span>{userData.sex === 1 ? 'Male' : 'Female'}</span>
                                <FontAwesomeIcon className={cx('drop-icon')} icon={faChevronDown} />
                            </div>
                            {dropDownMenu == 'sex' && (
                                <ul className={cx('item-list')} onClick={() => setDropDownMenu(undefined)}>
                                    <li
                                        onClick={(e) =>
                                            setUserData((prev) => {
                                                return { ...prev, sex: 1 };
                                            })
                                        }
                                    >
                                        Male
                                    </li>
                                    <li
                                        onClick={(e) =>
                                            setUserData((prev) => {
                                                return { ...prev, sex: 0 };
                                            })
                                        }
                                    >
                                        Female
                                    </li>
                                </ul>
                            )}
                        </div>

                        <div className={cx('drop-down-menu', 'input-box')}>
                            <span className={cx('input-label')}>Role*</span>
                            <div
                                className={cx('drop-down-header')}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDropDownMenu((prev) => {
                                        if (prev == 'role') {
                                            return undefined;
                                        } else {
                                            return 'role';
                                        }
                                    });
                                }}
                            >
                                <span>{userData.role}</span>
                                <FontAwesomeIcon className={cx('drop-icon')} icon={faChevronDown} />
                            </div>
                            {dropDownMenu == 'role' &&
                                user_role.current !== 'Manager' &&
                                user_role.current !== 'Director' && (
                                    <ul className={cx('item-list')} onClick={() => setDropDownMenu(undefined)}>
                                        {userData?.role === 'Director' && (
                                            <li
                                                onClick={(e) =>
                                                    setUserData((prev) => {
                                                        return { ...prev, role: 'Manager' };
                                                    })
                                                }
                                            >
                                                Manager
                                            </li>
                                        )}
                                        <li
                                            onClick={(e) =>
                                                setUserData((prev) => {
                                                    return { ...prev, role: 'Tester' };
                                                })
                                            }
                                        >
                                            Tester
                                        </li>
                                        <li
                                            onClick={(e) =>
                                                setUserData((prev) => {
                                                    return { ...prev, role: 'Designer' };
                                                })
                                            }
                                        >
                                            Designer
                                        </li>
                                        <li
                                            onClick={(e) =>
                                                setUserData((prev) => {
                                                    return { ...prev, role: 'Developer' };
                                                })
                                            }
                                        >
                                            Developer
                                        </li>
                                    </ul>
                                )}
                        </div>

                        <div className={cx('input-box')}>
                            <input
                                spellCheck={false}
                                value={userData.user_name || ''}
                                placeholder="User Name*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, user_name: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>User Name*</span>
                        </div>

                        <div className={cx('input-box')}>
                            <input
                                spellCheck={false}
                                value={userData.salary || ''}
                                placeholder="Salary*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, salary: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Salary*</span>
                        </div>

                        <div className={cx('input-box')}>
                            <input
                                spellCheck={false}
                                value={userData.email || ''}
                                placeholder="Email*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, email: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Email*</span>
                        </div>

                        {user_role.current !== 'Director' && (
                            <div className={cx('drop-down-menu', 'input-box')}>
                                <span className={cx('input-label')}>Department*</span>
                                <div
                                    className={cx('drop-down-header')}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDropDownMenu((prev) => {
                                            if (prev == 'department') {
                                                return undefined;
                                            } else {
                                                return 'department';
                                            }
                                        });
                                    }}
                                >
                                    <span>{userData.dep_name}</span>
                                    <FontAwesomeIcon className={cx('drop-icon')} icon={faChevronDown} />
                                </div>
                                {dropDownMenu == 'department' &&
                                    userData?.role === 'Director' &&
                                    userData.role !== 'Manager' && (
                                        <ul className={cx('item-list')} onClick={() => setDropDownMenu(undefined)}>
                                            {departments?.map((dep) => (
                                                <li
                                                    key={dep.dep_id}
                                                    onClick={(e) =>
                                                        setUserData((prev) => {
                                                            return {
                                                                ...prev,
                                                                dep_id: dep.dep_id,
                                                                dep_name: dep.dep_name,
                                                            };
                                                        })
                                                    }
                                                >
                                                    {dep.dep_name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                            </div>
                        )}

                        <div className={cx('input-box')}>
                            <span className={cx('input-label')}>Birth Date*</span>
                            <Datetime
                                value={new Date(userData.birth_date)}
                                onChange={(value) =>
                                    setUserData((prev) => {
                                        return { ...prev, birth_date: value.format() };
                                    })
                                }
                            />
                        </div>

                        <div className={cx('input-box')}>
                            <span className={cx('input-label')}>Joining Date*</span>
                            <Datetime
                                value={moment(userData.joining_date)}
                                onChange={(value) =>
                                    setUserData((prev) => {
                                        return { ...prev, joining_date: value.format() };
                                    })
                                }
                            />
                        </div>

                        <div className={cx('input-box', 'w100')}>
                            <textarea
                                spellCheck={false}
                                value={userData.about || ''}
                                rows={3}
                                placeholder="About*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, about: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>About*</span>
                        </div>

                        <div className={cx('input-box')}>
                            <textarea
                                spellCheck={false}
                                value={userData.degree || ''}
                                rows={3}
                                placeholder="Degree*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, degree: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Degree*</span>
                        </div>

                        <div className={cx('input-box')}>
                            <textarea
                                spellCheck={false}
                                value={userData.education || ''}
                                rows={3}
                                placeholder="Education*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, education: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Education*</span>
                        </div>

                        <div className={cx('input-box')}>
                            <textarea
                                spellCheck={false}
                                value={userData.experience || ''}
                                rows={3}
                                placeholder="Experience*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, experience: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Experience*</span>
                        </div>
                        <div className={cx('input-box', 'address-inp')}>
                            <textarea
                                spellCheck={false}
                                value={userData.address || ''}
                                rows={3}
                                placeholder="Address*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, address: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Address*</span>
                        </div>

                        <div className={cx('input-box', 'upload-img-area', 'w100')}>
                            <Button
                                className={cx('select-avatar-btn')}
                                title="Select Avatar"
                                onClick={() => avatarinpRef.current.click()}
                                primary
                                icon={<FontAwesomeIcon icon={faPaperPlane} />}
                            />
                            <p className={cx('file_name')}>
                                {userData?.user_avatar?.name || 'or drag and drop file here'}
                            </p>
                        </div>
                    </div>
                    <div className={cx('footer')}>
                        <input
                            spellCheck={false}
                            ref={avatarinpRef}
                            className={cx('avatar-input')}
                            accept="image/png, image/gif, image/jpeg"
                            type="file"
                            onChange={(e) =>
                                setUserData((prev) => {
                                    return { ...prev, user_avatar: e.target.files[0] };
                                })
                            }
                        />

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
                    content={'Do you really want to edit this employee?'}
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

export default EmployeeEditor;
