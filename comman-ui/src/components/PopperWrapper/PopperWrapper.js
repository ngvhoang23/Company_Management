import classNames from 'classnames/bind';
import styles from './PopperWrapper.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faRotateRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function PopperWrapper({ fields, children, title, onAddNew, onReload, icon }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <span className={cx('header-icon')}>{icon}</span>
                <span className={cx('header-title')}>{title}</span>
                {onAddNew && (
                    <button className={cx('plus-btn')} onClick={onAddNew}>
                        <FontAwesomeIcon className={cx('plus-icon')} icon={faPlus} />
                    </button>
                )}
                {onReload && (
                    <button className={cx('reload-btn')} onClick={onReload}>
                        <FontAwesomeIcon className={cx('reload-icon')} icon={faRotateRight} />
                    </button>
                )}
            </div>
            <div className={cx('content')}>
                <div className={cx('label')}>
                    {fields.map((item, index) => (
                        <div key={index} className={cx('label-item', `flex-${item.ratio}`)}>
                            {item.name}
                        </div>
                    ))}
                </div>

                <div className={cx('employee-list')}>{children}</div>
            </div>
        </div>
    );
}

export default PopperWrapper;
