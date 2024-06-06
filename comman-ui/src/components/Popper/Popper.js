import classNames from 'classnames/bind';
import styles from './Popper.module.scss';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Popper({ isVisible, setIsVisible, children }) {
    return (
        <>
            {isVisible && (
                <div className={cx('wrapper')} onClick={() => setIsVisible(false)}>
                    <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
                        {children}
                    </div>
                </div>
            )}
        </>
    );
}

export default Popper;
