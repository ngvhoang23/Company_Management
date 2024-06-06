import classNames from 'classnames/bind';
import styles from './StatusModal.module.scss';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function StatusModal({ status, content, onClose }) {
    useEffect(() => {
        setTimeout(() => {
            onClose();
        }, 1200);
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                {status ? (
                    <img src={require('~/assets/images/success_icon.gif')} />
                ) : (
                    <img src={require('~/assets/images/fail_icon.gif')} />
                )}
                <p>{content}</p>
            </div>
        </div>
    );
}

export default StatusModal;
