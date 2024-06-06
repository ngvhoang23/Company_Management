import classNames from 'classnames/bind';
import styles from './PostItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import MediaItem2 from '../MediaItem2/MediaItem2';

const cx = classNames.bind(styles);

function PostItem({ post, className, isOwner, onDeletePost, owner_role }) {
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
    return (
        <div className={cx('wrapper', { [className]: className })}>
            <div className={cx('header')}>
                <div className={cx('user-avatar-container')}>
                    {owner_role == 'Director' ? (
                        <img className={cx('role-icon')} src={require('../../assets/images/star_icon.png')} />
                    ) : (
                        <img className={cx('role-icon')} src={require('../../assets/images/emp_icon.png')} />
                    )}
                    <MediaItem2
                        item={{ url: post.avatar, type: 'image' }}
                        width={46}
                        height={46}
                        border_radius={1000}
                        _styles={{
                            boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                        }}
                        className={cx('user-avatar')}
                    />
                </div>
                <div className={cx('info')}>
                    <div>
                        <span className={cx('user-name')}>{post.emp_name}</span>
                        <span> posted on </span>
                        <span className={cx('dep-name')}>{post.dep_name ? post.dep_name : 'company'}</span>
                    </div>
                    <span className={cx('time-stamp')}>{formatDate(post.created_at)}</span>
                </div>
                {isOwner && (
                    <div className={cx('col-item', 'flex-5')}>
                        <button
                            className={cx('action-btn', 'edit-btn')}
                            onClick={() => {
                                navigate(`/posts/edit-post/${post.post_id}`, { replace: true });
                            }}
                        >
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </button>

                        <button className={cx('action-btn', 'remove-btn')} onClick={() => onDeletePost(post.post_id)}>
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    </div>
                )}
            </div>
            <div className={cx('content')} dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </div>
    );
}

export default PostItem;
