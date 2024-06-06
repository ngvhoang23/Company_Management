import classNames from 'classnames/bind';
import styles from './Button.module.scss';

const cx = classNames.bind(styles);

function Button({ title, className, onClick, primary, icon }) {
    return (
        <button className={cx('wrapper', className, { primary: primary })} onClick={onClick}>
            {icon && <span>{icon}</span>}
            <p>{title}</p>
        </button>
    );
}

export default Button;
