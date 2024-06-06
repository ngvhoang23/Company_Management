import classNames from 'classnames/bind';
import styles from './AddEmployee.module.scss';
import PageHeader from '../components/PageHeader/PageHeader';
import Datetime from 'react-datetime';
import FormData from 'form-data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmBox from '~/components/ConfirmBox/ConfirmBox';
import Button from '~/components/Button/Button';
import Cookies from 'universal-cookie';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function AddEmployee() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('USER_INFO'));

    const avatarinpRef = useRef();

    const [isOpenDepPicker, setIsOpenDepPicker] = useState();
    const [isOpenSexPicker, setIsOpenSexPicker] = useState();
    const [isOpenRolePicker, setIsOpenRolePicker] = useState();
    const [isClick, setIsClick] = useState(false);

    const [dropDownMenu, setDropDownMenu] = useState();

    const [isShowConfirmBox, setIsShowConfirmBox] = useState(false);

    const [departments, setDepartments] = useState([]);

    const [userData, setUserData] = useState({
        sex: 1,
        role: '',
        department: departments[0]?.dep_id,
        joining_date: moment(new Date()).format(),
        birth_date: moment(new Date()).format(),

        citizen_identification: '',
        phone_num: '',
        emp_name: '',
        user_name: '',
        password: '',
        salary: 0,
        email: '',
        dep_id: '',
        about: '',
        degree: '',
        education: '',
        experience: '',
        address: '',
    });

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
                    return dep.dep_id === user?.dep_id;
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
        if (!(userData.citizen_identification && userData.user_name && userData.emp_name && userData.password)) {
            alert('You must fill in all the required fields.!');
            return;
        }

        const formData = new FormData();

        formData.append('userData', JSON.stringify(userData));
        formData.append('userAvatar', userData.user_avatar);

        const config = {
            headers: {},
            headers: {
                ['content-type']: 'multipart/form-data',
                Authorization: `Bearer ${cookies.get('access_token')}`,
            },
        };

        axios
            .post(`http://localhost:5000/employees`, formData, config)
            .then((result) => {
                navigate('/employees', { replace: true });
            })
            .catch((error) => {
                error = new Error();
            });
    };

    return (
        <>
            <div
                className={cx('wrapper')}
                onClick={() => setDropDownMenu()}
                style={{ backgroundImage: `url(${require('../../assets/images/post_bg2.jpg')})` }}
            >
                <PageHeader
                    title="Add Employee"
                    icon={
                        <img
                            style={{ height: '54px', width: '54px' }}
                            src={require('../../assets/images/user_plus_icon.png')}
                        />
                    }
                />
                <div className={cx('container')}>
                    <div className={cx('input-container')}>
                        <div className={cx('input-box')}>
                            <input
                                placeholder="citizen identification*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, citizen_identification: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>citizen identification*</span>
                        </div>

                        <div className={cx('input-box')}>
                            <input
                                placeholder="Mobile*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, phone_num: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Mobile</span>
                        </div>

                        <div className={cx('input-box')}>
                            <input
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
                                <ul className={cx('item-list')}>
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
                            {dropDownMenu == 'role' && (
                                <ul className={cx('item-list')}>
                                    {user?.role === 'Director' && (
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
                                    {userData.dep_id == 2 && (
                                        <li
                                            onClick={(e) =>
                                                setUserData((prev) => {
                                                    return { ...prev, role: 'Tester' };
                                                })
                                            }
                                        >
                                            Tester
                                        </li>
                                    )}
                                    {userData.dep_id == 3 && (
                                        <li
                                            onClick={(e) =>
                                                setUserData((prev) => {
                                                    return { ...prev, role: 'Designer' };
                                                })
                                            }
                                        >
                                            Designer
                                        </li>
                                    )}
                                    {userData.dep_id == 1 && (
                                        <li
                                            onClick={(e) =>
                                                setUserData((prev) => {
                                                    return { ...prev, role: 'Developer' };
                                                })
                                            }
                                        >
                                            Developer
                                        </li>
                                    )}
                                    {user?.role === 'Director' && (
                                        <li
                                            onClick={(e) =>
                                                setUserData((prev) => {
                                                    return { ...prev, role: 'Director' };
                                                })
                                            }
                                        >
                                            Director
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>

                        <div className={cx('input-box')}>
                            <input
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
                                placeholder="Password*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, password: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Password*</span>
                        </div>

                        <div className={cx('input-box')}>
                            <input
                                placeholder="Salary"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, salary: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Salary</span>
                        </div>

                        <div className={cx('input-box')}>
                            <input
                                placeholder="Email"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, email: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Email</span>
                        </div>

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
                            {dropDownMenu == 'department' && user?.role === 'Director' && (
                                <ul className={cx('item-list')} onClick={() => setIsOpenDepPicker(false)}>
                                    {departments?.map((dep) => (
                                        <li
                                            key={dep.dep_id}
                                            onClick={(e) =>
                                                setUserData((prev) => {
                                                    return { ...prev, dep_id: dep.dep_id, dep_name: dep.dep_name };
                                                })
                                            }
                                        >
                                            {dep.dep_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className={cx('input-box')}>
                            <span className={cx('input-label')}>Birth Date</span>
                            <Datetime
                                initialValue={new Date()}
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
                                initialValue={new Date()}
                                onChange={(value) =>
                                    setUserData((prev) => {
                                        return { ...prev, joining_date: value.format() };
                                    })
                                }
                            />
                        </div>

                        <div className={cx('input-box', 'w100')}>
                            <textarea
                                rows={3}
                                placeholder="About*"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, about: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>About</span>
                        </div>

                        <div className={cx('input-box')}>
                            <textarea
                                rows={3}
                                placeholder="Degree"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, degree: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Degree</span>
                        </div>

                        <div className={cx('input-box')}>
                            <textarea
                                rows={3}
                                placeholder="Education"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, education: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Education</span>
                        </div>

                        <div className={cx('input-box')}>
                            <textarea
                                rows={3}
                                placeholder="Experience"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, experience: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Experience</span>
                        </div>
                        <div className={cx('input-box', 'address-inp')}>
                            <textarea
                                rows={3}
                                placeholder="Address"
                                onChange={(e) =>
                                    setUserData((prev) => {
                                        return { ...prev, address: e.target.value };
                                    })
                                }
                            />
                            <span className={cx('input-label')}>Address</span>
                        </div>

                        <div className={cx('input-box', 'upload-img-area', 'w100')}>
                            <Button
                                className={cx('select-avatar-btn')}
                                title="Select Avatar"
                                onClick={() => avatarinpRef.current.click()}
                                primary
                                icon={<FontAwesomeIcon icon={faPaperPlane} />}
                            />
                            <p className={cx('file-name')}>
                                {userData?.user_avatar?.name || 'or drag and drop file here'}
                            </p>
                        </div>
                    </div>
                    <div className={cx('footer')}>
                        <input
                            ref={avatarinpRef}
                            className={cx('avatar-input')}
                            type="file"
                            accept="image/png, image/gif, image/jpeg"
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
                    content={'Do you really want to add new employee?'}
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

export default AddEmployee;
