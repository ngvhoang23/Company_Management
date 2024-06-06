import classNames from 'classnames/bind';
import styles from './SentRequests.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function RequestItem({ request, className, action, onClick }) {
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    let status = 'Pending';

    if (request.status == 1) {
        status = 'Approved';
    } else if (request.status == 2) {
        status = 'Reject';
    }

    return (
        <div className={cx('request-row', { [className]: className })} onClick={onClick}>
            <div className={cx('col-item', 'img-item', 'flex-3')}>
                <img className={cx('employee-avatar')} src={request.avatar} alt="avatar" />
            </div>
            <div className={cx('col-item', 'flex-5')}>{request.emp_name}</div>
            <div className={cx('col-item', 'flex-5')}>{request.req_type}</div>
            <div className={cx('col-item', 'flex-3')}>{status}</div>
            <div className={cx('col-item', 'flex-10')}>{formatDate(request.created_at)}</div>
            <div
                className={cx('request-content', 'flex-10')}
                dangerouslySetInnerHTML={{ __html: request.content }}
            ></div>
            <div className={cx('col-item', 'flex-3')} onClick={(e) => e.stopPropagation()}>
                {action ? action : <></>}
            </div>
        </div>
    );
}

export default RequestItem;
