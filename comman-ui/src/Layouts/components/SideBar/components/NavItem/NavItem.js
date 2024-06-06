import classNames from 'classnames/bind';
import styles from './NavItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useParams } from 'react-router-dom';
import useOutsideAlerter from '~/hooks/useOutsideAlerter';
import { UserInfoContext } from '~/Context/UserInfoContext';

const cx = classNames.bind(styles);

function NavItem({
    className,
    hoveredClassName,
    labelName,
    labelIcon,
    navList,
    to,
    active,
    current_path,
    currentNavItem,
    setCurrentNavItem,
    name,
}) {
    const userInfoContext = useContext(UserInfoContext);
    const userInfo = userInfoContext.userInfo;
    const setUserInfo = userInfoContext.setUserInfo;

    const navItemRef = useRef();

    const [isShowMenu, setIsShowMenu] = useState(false);

    let Comp = to ? NavLink : 'div';

    useEffect(() => {
        if (currentNavItem == name) {
            setIsShowMenu(true);
        } else {
            setIsShowMenu(false);
        }
    }, [currentNavItem]);

    return (
        <Comp
            ref={navItemRef}
            to={to}
            className={cx('wrapper', { active: active }, className)}
            onClick={() => setCurrentNavItem(name)}
        >
            <div
                className={cx('label', hoveredClassName)}
                onClick={() => {
                    if (navList) {
                        setIsShowMenu((prev) => !prev);
                    } else {
                        setIsShowMenu(true);
                    }
                }}
            >
                <div className={cx('label-container')}>
                    <span className={cx('label-icon')}>{labelIcon}</span>
                    <p className={cx('label-name')}>{labelName}</p>
                </div>
                {navList && (
                    <span>
                        {currentNavItem == name && isShowMenu ? (
                            <FontAwesomeIcon className={cx('drop-icon')} icon={faChevronDown} />
                        ) : (
                            <FontAwesomeIcon className={cx('drop-icon')} icon={faChevronRight}></FontAwesomeIcon>
                        )}
                    </span>
                )}
            </div>

            {currentNavItem == name && isShowMenu && navList && (
                <ul className={cx('drop-down-menu')}>
                    {navList.map((item, index) => {
                        if (!item.for) {
                            return (
                                <Link
                                    key={index}
                                    className={cx('item-link', { ['item-active']: current_path == item.to })}
                                    to={item.to}
                                >
                                    <li className={cx('menu-item')}>
                                        <p>{item.name}</p>
                                    </li>
                                </Link>
                            );
                        } else {
                            if (
                                item?.for?.includes(userInfo.role) ||
                                (item?.for?.includes('Employee') && userInfo.role !== 'Director')
                            ) {
                                return (
                                    <Link
                                        key={index}
                                        className={cx('item-link', { ['item-active']: current_path == item.to })}
                                        to={item.to}
                                    >
                                        <li className={cx('menu-item', hoveredClassName)}>
                                            <p>{item.name}</p>
                                        </li>
                                    </Link>
                                );
                            } else {
                                return <></>;
                            }
                        }
                    })}
                </ul>
            )}
        </Comp>
    );
}

export default NavItem;
