import classNames from 'classnames/bind';
import styles from './PageHeader.module.scss';

import { faChevronRight, faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function PageHeader({ title, icon, is_search, searchValue, setSearchValue, onSearch, onClick }) {
    return (
        <div className={cx('header')}>
            <div className={cx('page-name')} onClick={onClick}>
                <span>{icon}</span>
                <h2>{title}</h2>
            </div>
            {is_search && (
                <div className={cx('search')}>
                    <img onClick={onSearch} src={require('../../../assets/images/search_icon.png')} />
                    <input
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                        }}
                        spellCheck={false}
                    />
                </div>
            )}
        </div>
    );
}

export default PageHeader;
