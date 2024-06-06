import classNames from 'classnames/bind';
import styles from './DetailInfo.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

function DetailInfo({ about, education, experience }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('info-group')}>
                <div className={cx('header')}>
                    <img
                        style={{ height: '36px', width: '36px' }}
                        src={require('~/assets/images/user_info_icon.png')}
                    />
                    <label className={cx('label')}>About</label>
                </div>
                <div className={cx('content')}>{about}</div>
            </div>
            <div className={cx('info-group')}>
                <div className={cx('header')}>
                    <img style={{ height: '36px', width: '36px' }} src={require('~/assets/images/degree_icon.png')} />
                    <label className={cx('label')}>Education</label>
                </div>
                <div className={cx('content')}>{education}</div>
            </div>
            <div className={cx('info-group')}>
                <div className={cx('header')}>
                    <img style={{ height: '36px', width: '36px' }} src={require('~/assets/images/work_icon.png')} />
                    <label className={cx('label')}>Experience</label>
                </div>
                <div className={cx('content')}>{experience}</div>
            </div>
        </div>
    );
}

export default DetailInfo;
