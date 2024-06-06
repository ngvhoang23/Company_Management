import classNames from 'classnames/bind';
import styles from './ProfileEditor.module.scss';
import PageHeader from '../components/PageHeader/PageHeader';
import { useContext, useRef, useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faEnvelope, faPaperPlane, faPhone } from '@fortawesome/free-solid-svg-icons';
import DetailInfo from '../Profile/components/DetailInfo/DetailInfo';
import moment from 'moment';
import Datetime from 'react-datetime';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmBox from '~/components/ConfirmBox/ConfirmBox';
import Button from '~/components/Button/Button';
import { UserInfoContext } from '~/Context/UserInfoContext';
import Cookies from 'universal-cookie';
import { IsFetchProfileContext } from '~/Context/IsFetchProfileContext';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function ProfileEditor() {
    const userInfoContext = useContext(UserInfoContext);
    const userInfo = userInfoContext.userInfo;
    const setUserInfo = userInfoContext.setUserInfo;

    const isFetchProfileContext = useContext(IsFetchProfileContext);
    const isFetch = isFetchProfileContext.isFetch;
    const setIsFetch = isFetchProfileContext.setIsFetch;

    const navigate = useNavigate();

    const avatarinpRef = useRef();

    const [userData, setUserData] = useState({});
    const [dropDownMenu, setDropDownMenu] = useState();
    const [departments, setDepartments] = useState([]);
    const [isShowConfirmBox, setIsShowConfirmBox] = useState(false);

    const user_role = useRef('');
    const user_name = useRef('');
    const password = useRef('');

    useEffect(() => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/employees/inindividual-info`,
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        axios(configuration)
            .then((result) => {
                result.data[0].birth_date = moment(result.data[0].birth_date).format();
                result.data[0].joining_date = moment(result.data[0].joining_date).format();
                user_role.current = result.data[0].role;
                user_name.current = result.data[0].user_name;
                password.current = result.data[0].password;
                setUserData(result.data[0]);
            })
            .catch((error) => {
                error = new Error();
            });
    }, [userInfo?.emp_id]);

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

    const handleSubmit = () => {
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
            .put(`http://localhost:5000/employees/personal-profile/${userData.emp_id}`, formData, config)
            .then((result) => {
                setIsFetch((prev) => !prev);
                navigate(`/profile`, { replace: true });
            })
            .catch((error) => {
                error = new Error();
                console.log(error);
            });
    };

    return (
        <>
            <div
                className={cx('wrapper')}
                onClick={() => setDropDownMenu(undefined)}
                style={{ backgroundImage: `url(${require('../../assets/images/post_bg2.jpg')})` }}
            >
                <PageHeader
                    title="Edit Profile"
                    icon={
                        <img
                            style={{ height: '54px', width: '54px' }}
                            src={require('../../assets/images/edit_user_icon.png')}
                        />
                    }
                />
                <div className={cx('container')}>
                    <div className={cx('input-container')}>
                        <div className={cx('input-box', 'disabled')}>
                            <span className={cx('input-label')}>Employee ID*</span>
                            <input
                                className={cx('disabled')}
                                readOnly={true}
                                value={userData.citizen_identification || ''}
                                placeholder="Employee ID*"
                            />
                        </div>

                        <div className={cx('input-box')}>
                            <span className={cx('input-label')}>Phone Number*</span>

                            <input
                                value={userData.phone_num || ''}
                                placeholder="Mobile*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, phone_num: e.target.value };
                                    })
                                }
                            />
                        </div>

                        <div className={cx('input-box')}>
                            <span className={cx('input-label')}>Full name*</span>
                            <input
                                className={cx({ disabled: user_role.current != 'Director' })}
                                readOnly={user_role.current != 'Director'}
                                value={userData.emp_name || ''}
                                placeholder="Full name*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, emp_name: e.target.value };
                                    })
                                }
                            />
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
                            {dropDownMenu == 'sex' && user_role.current == 'Director' && (
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
                            {false && (
                                <ul className={cx('item-list')} onClick={() => setDropDownMenu(undefined)}>
                                    {userInfo?.role === 'Director' && (
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
                            <span className={cx('input-label')}>Salary*</span>
                            <input
                                className={cx({ disabled: user_role.current != 'Director' })}
                                readOnly={user_role.current != 'Director'}
                                value={userData.salary || ''}
                                placeholder="Salary*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, salary: e.target.value };
                                    })
                                }
                            />
                        </div>

                        <div className={cx('input-box')}>
                            <span className={cx('input-label')}>Email*</span>
                            <input
                                value={userData.email || ''}
                                placeholder="Email*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, email: e.target.value };
                                    })
                                }
                            />
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
                                    userInfo?.role === 'Director' &&
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
                            {user_role.current == 'Director' ? (
                                <Datetime
                                    value={moment(userData.joining_date)}
                                    onChange={(value) =>
                                        setUserData((prev) => {
                                            return { ...prev, joining_date: value.format() };
                                        })
                                    }
                                />
                            ) : (
                                <Datetime value={moment(userData.joining_date)} open={false} />
                            )}
                        </div>

                        <div className={cx('input-box', 'w100')}>
                            <span className={cx('input-label')}>About*</span>
                            <textarea
                                className={cx({ disabled: user_role.current != 'Director' })}
                                readOnly={user_role.current != 'Director'}
                                value={userData.about || ''}
                                rows={3}
                                placeholder="About*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, about: e.target.value };
                                    })
                                }
                            />
                        </div>

                        <div className={cx('input-box')}>
                            <span className={cx('input-label')}>Degree*</span>
                            <textarea
                                className={cx({ disabled: user_role.current != 'Director' })}
                                readOnly={user_role.current != 'Director'}
                                value={userData.degree || ''}
                                rows={3}
                                placeholder="Degree*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, degree: e.target.value };
                                    })
                                }
                            />
                        </div>

                        <div className={cx('input-box')}>
                            <span className={cx('input-label')}>Education*</span>
                            <textarea
                                className={cx({ disabled: user_role.current != 'Director' })}
                                readOnly={user_role.current != 'Director'}
                                value={userData.education || ''}
                                rows={3}
                                placeholder="Education*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, education: e.target.value };
                                    })
                                }
                            />
                        </div>

                        <div className={cx('input-box')}>
                            <span className={cx('input-label')}>Experience*</span>
                            <textarea
                                className={cx({ disabled: user_role.current != 'Director' })}
                                readOnly={user_role.current != 'Director'}
                                value={userData.experience || ''}
                                rows={3}
                                placeholder="Experience*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, experience: e.target.value };
                                    })
                                }
                            />
                        </div>
                        <div className={cx('input-box', 'address-inp')}>
                            <span className={cx('input-label')}>Address*</span>
                            <textarea
                                value={userData.address || ''}
                                rows={3}
                                placeholder="Address*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, address: e.target.value };
                                    })
                                }
                            />
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
                            readOnly={user_role.current != 'Director'}
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
                    content={'Do you really want to edit your profile?'}
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

export default ProfileEditor;
