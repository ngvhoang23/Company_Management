import classNames from 'classnames/bind';
import styles from './SideBar.module.scss';
import NavItem from './components/NavItem/NavItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowRightFromBracket,
    faBarsProgress,
    faBlog,
    faBook,
    faCalendar,
    faStar,
    faUser,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getPosition } from '~/userDefineFunction';
import axios from 'axios';
import logo from '~/assets/images/joomla.png';
import MediaItem2 from '~/components/MediaItem2/MediaItem2';
import { UserInfoContext } from '~/Context/UserInfoContext';
import Cookies from 'universal-cookie';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function SideBar() {
    const { pathname } = useLocation();

    const navigate = useNavigate();

    const userInfoContext = useContext(UserInfoContext);
    const userInfo = userInfoContext.userInfo;
    const setUserInfo = userInfoContext.setUserInfo;

    const [path, setPath] = useState();
    const [currentNavItem, setCurrentNavItem] = useState();

    useEffect(() => {
        const pos = getPosition(pathname, '/', 2);
        const result = pathname.slice(0, pos);
        setPath(result);
    }, [pathname]);

    const cookies = new Cookies();

    return (
        <div className={cx('wrapper')}>
            <div className={cx('side-bar-header')} onClick={() => navigate('/posts')}>
                <img className={cx('company-logo')} src={require('../../../assets/images/logo.png')} alt="header-img" />
                <p className={cx('company-name')}>Kuber</p>
            </div>
            <div className={cx('user-info')}>
                <MediaItem2
                    item={{ url: userInfo.avatar, type: 'image' }}
                    width={75}
                    height={75}
                    border_radius={15}
                    _styles={{
                        boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                    }}
                    className={cx('user-img')}
                />
                <h4 className={cx('user-name')}>{userInfo.emp_name}</h4>
                <div className={cx('user-role')}>
                    {userInfo.role == 'Director' ? (
                        <div className={cx('role-icon')}>
                            <img src={require('~/assets/images/star_icon.png')} />
                        </div>
                    ) : (
                        <div className={cx('role-icon')}>
                            <img src={require('~/assets/images/emp_icon.png')} />
                        </div>
                    )}
                    <p className={cx('user-role')}>{userInfo.role}</p>
                </div>
            </div>
            <div className={cx('navigation-container')}>
                <div className={cx('nav-group')}>
                    <div className={cx('navigation-menu')}>
                        <NavItem
                            className={cx('navigation-item')}
                            labelName="Posts"
                            labelIcon={
                                <MediaItem2
                                    item={{ url: require('../../../assets/images/home_icon.png'), type: 'image' }}
                                    width={26}
                                    height={26}
                                    _styles={{}}
                                />
                            }
                            navList={[
                                { name: 'All Posts', to: '/posts' },
                                { name: 'Add Post', to: '/posts/add-post', for: ['Director', 'Manager'] },
                            ]}
                            active={path === '/posts'}
                            name={'posts'}
                            current_path={pathname}
                            currentNavItem={currentNavItem}
                            setCurrentNavItem={setCurrentNavItem}
                        />

                        <NavItem
                            className={cx('navigation-item')}
                            labelName="Documents"
                            labelIcon={
                                <MediaItem2
                                    item={{ url: require('../../../assets/images/folder_icon.png'), type: 'image' }}
                                    width={26}
                                    height={26}
                                    _styles={{}}
                                />
                            }
                            navList={[
                                { name: 'All Documents', to: '/documents' },
                                { name: 'Add Documents', to: '/documents/add-document', for: ['Director'] },
                            ]}
                            active={path === '/documents'}
                            name={'documents'}
                            current_path={pathname}
                            currentNavItem={currentNavItem}
                            setCurrentNavItem={setCurrentNavItem}
                        />

                        <NavItem
                            className={cx('navigation-item')}
                            labelName="Employees"
                            labelIcon={
                                <MediaItem2
                                    item={{ url: require('../../../assets/images/employees_icon.png'), type: 'image' }}
                                    width={26}
                                    height={26}
                                    _styles={{}}
                                />
                            }
                            navList={[
                                { name: 'All Employees', to: '/employees' },
                                { name: 'Add Employee', to: '/employees/add-employee', for: ['Director', 'Manager'] },
                            ]}
                            active={path === '/employees'}
                            name={'employees'}
                            current_path={pathname}
                            currentNavItem={currentNavItem}
                            setCurrentNavItem={setCurrentNavItem}
                        />

                        <NavItem
                            className={cx('navigation-item')}
                            labelName="Profile"
                            labelIcon={
                                <MediaItem2
                                    item={{ url: require('../../../assets/images/profile_icon.png'), type: 'image' }}
                                    width={26}
                                    height={26}
                                    _styles={{}}
                                />
                            }
                            navList={[
                                { name: 'My Profile', to: '/profile' },
                                { name: 'Edit Profile', to: '/profile/edit-profile' },
                            ]}
                            active={path === '/profile'}
                            name={'profile'}
                            current_path={pathname}
                            currentNavItem={currentNavItem}
                            setCurrentNavItem={setCurrentNavItem}
                        />
                        <NavItem
                            className={cx('navigation-item')}
                            labelName="Calendar"
                            labelIcon={
                                <MediaItem2
                                    item={{ url: require('../../../assets/images/calendar_icon.png'), type: 'image' }}
                                    width={26}
                                    height={26}
                                    _styles={{}}
                                />
                            }
                            navList={[
                                { name: 'Schedule', to: '/calendars' },
                                { name: 'Schedule Requests', to: '/calendars/requests', for: ['Director'] },
                                { name: 'Sent Request', to: '/calendars/sent-requests', for: ['Manager'] },
                                { name: 'Add Schedule', to: '/calendars/add-calendar', for: ['Director', 'Manager'] },
                            ]}
                            active={path === '/calendar'}
                            name={'calendar'}
                            current_path={pathname}
                            currentNavItem={currentNavItem}
                            setCurrentNavItem={setCurrentNavItem}
                        />

                        <NavItem
                            className={cx('navigation-item')}
                            labelName="Request"
                            labelIcon={
                                <MediaItem2
                                    item={{ url: require('../../../assets/images/request_icon.png'), type: 'image' }}
                                    width={26}
                                    height={26}
                                    _styles={{}}
                                />
                            }
                            navList={[
                                {
                                    name: 'Arrival Request',
                                    to: '/requests/arrival-requests',
                                    for: ['Director', 'Manager'],
                                },
                                { name: 'Sent Request', to: '/requests/sent-requests', for: ['Manager', 'Employee'] },
                                { name: 'Add Request', to: '/requests/add-request', for: ['Manager', 'Employee'] },
                                { name: 'Edit Request', to: '/requests/edit-request', for: ['Manager', 'Employee'] },
                            ]}
                            active={path === '/requests'}
                            current_path={pathname}
                            name={'request'}
                            currentNavItem={currentNavItem}
                            setCurrentNavItem={setCurrentNavItem}
                        />

                        <button
                            className={cx('com-structure-btn', { active: currentNavItem == 'com-structure' })}
                            onClick={() => {
                                setCurrentNavItem('com-structure');
                                navigate('/company-structure');
                            }}
                        >
                            <span className={cx('com-structure-icon')}>
                                <MediaItem2
                                    item={{
                                        url: require('../../../assets/images/organization_icon.png'),
                                        type: 'image',
                                    }}
                                    width={26}
                                    height={26}
                                    _styles={{}}
                                />
                            </span>
                            <p>Company Structure</p>
                        </button>
                    </div>
                    <div className={cx('footer')}>
                        <button
                            className={cx('logout-btn')}
                            onClick={() => {
                                cookies.remove('access_token');
                                navigate('/login');
                            }}
                        >
                            <span className={cx('logout-icon')}>
                                <FontAwesomeIcon className={cx('logout-icon')} icon={faArrowRightFromBracket} />
                            </span>
                            <p>Log out</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SideBar;
