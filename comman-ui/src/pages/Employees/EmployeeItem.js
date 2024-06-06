import classNames from 'classnames/bind';
import styles from './Employees.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

function EmployeeItem({ emp, className, onEditEmployee, onDeleteEmployee, onClick }) {
    const user = JSON.parse(localStorage.getItem('USER_INFO'));

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className={cx('employee-row', { [className]: className })} onClick={onClick}>
            <div className={cx('col-item', 'img-item', 'flex-3')}>
                <img className={cx('employee-avatar')} src={emp.avatar} alt="avatar" />
            </div>
            <div className={cx('col-item', 'flex-8')}>{emp.emp_name}</div>
            <div className={cx('col-item', 'flex-5')}>{emp.dep_name}</div>
            <div className={cx('col-item', 'flex-5')}>{emp.role}</div>
            <div className={cx('col-item', 'flex-5')}>{emp.degree}</div>
            <div className={cx('col-item', 'flex-5')}>{emp.phone_num}</div>
            <div className={cx('col-item', 'flex-10')}>{emp.email}</div>
            <div className={cx('col-item', 'flex-5')}>{formatDate(emp.joining_date)}</div>
            {(user?.role === 'Director' || (user?.role === 'Manager' && emp.dep_id === user?.dep_id)) && (
                <div className={cx('col-item', 'flex-5')}>
                    <>
                        <button
                            className={cx('action-btn', 'edit-btn')}
                            onClick={(e) => {
                                e.stopPropagation();
                                onEditEmployee();
                            }}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </button>

                        <button
                            className={cx('action-btn', 'remove-btn')}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteEmployee(emp.emp_id);
                            }}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </>
                </div>
            )}
        </div>
    );
}

export default EmployeeItem;
