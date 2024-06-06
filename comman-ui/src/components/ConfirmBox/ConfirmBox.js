import classNames from 'classnames/bind';
import styles from './ConfirmBox.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button/Button';

const cx = classNames.bind(styles);

function ConfirmBox({ content, onAprrove, onReject }) {
    return (
        <div className={cx('wrapper')} onClick={onReject}>
            <div className={cx('container')}>
                <div className={cx('header')}>
                    <div className={cx('title')}>
                        <img src={require('~/assets/images/warning_icon.png')} />
                        <p>Confirm Box</p>
                    </div>
                    <button className={cx('close-btn')} onClick={onReject}>
                        <FontAwesomeIcon className={cx('close-icon')} icon={faXmark} />
                    </button>
                </div>
                <div className={cx('body')}>
                    <p className={cx('content')}>{content}</p>
                </div>
                <div className={cx('footer')}>
                    <Button className={cx('approve-btn')} title="Confirm" onClick={onAprrove} primary />

                    <Button className={cx('reject-btn')} title="Cancel" onClick={onReject} />
                </div>
            </div>
        </div>
    );
}

export default ConfirmBox;
