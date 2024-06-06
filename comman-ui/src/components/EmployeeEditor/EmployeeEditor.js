import classNames from 'classnames/bind';
import styles from './EmployeeEditor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function EmployeeEditor({ setShowEmployeeEditor }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('user-info')}>
                    <img
                        className={cx('user-avatar')}
                        src="https://einfosoft.com/templates/admin/kuber/source/light/assets/images/user/user1.jpg"
                        alt=""
                    />
                    <h3 className={cx('user-name')}>John Doe</h3>
                </div>
                <button className={cx('close-btn')} onClick={() => setShowEmployeeEditor(false)}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
            <div className={cx('container')}>
                <div className={cx('body')}>
                    <div className={cx('input-field')}>
                        <label>Name</label>
                        <input />
                    </div>

                    <div className={cx('input-field')}>
                        <label>Name</label>
                        <input />
                    </div>

                    <div className={cx('input-field')}>
                        <label>Name</label>
                        <input />
                    </div>

                    <div className={cx('input-field')}>
                        <label>Name</label>
                        <input />
                    </div>

                    <div className={cx('input-field')}>
                        <label>Name</label>
                        <input />
                    </div>

                    <div className={cx('input-field')}>
                        <label>Name</label>
                        <input />
                    </div>
                </div>

                <div className={cx('footer')}>
                    <button className={cx('save-btn')}>Save</button>
                    <button className={cx('cancel-btn')} onClick={() => setShowEmployeeEditor(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EmployeeEditor;
