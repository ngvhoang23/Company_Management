import classNames from 'classnames/bind';
import styles from './LoadingModal.module.scss';
import LoadingSpinner from '~/components/LoadingSpinner';
import { useContext } from 'react';
import { IsLoadingContext } from '~/Context/LoadingContext';

const cx = classNames.bind(styles);

function LoadingModal() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <LoadingSpinner large />
            </div>
        </div>
    );
}

export default LoadingModal;
