import classNames from 'classnames/bind';
import styles from './AddPost.module.scss';
import PageHeader from '../components/PageHeader/PageHeader';
import { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import ConfirmBox from '~/components/ConfirmBox/ConfirmBox';
import 'react-quill/dist/quill.snow.css';
import './quill.css';
import Button from '~/components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'universal-cookie';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function AddPost() {
    const user = JSON.parse(localStorage.getItem('USER_INFO'));

    const navigate = useNavigate();

    const [isShowConfirmBox, setIsShowConfirmBox] = useState(false);

    const [postData, setPostData] = useState({
        content: '',
    });

    const handleSubmit = () => {
        if (!postData.content) {
            alert('You must fill in all the required fields.');
            return;
        }
        const configuration = {
            method: 'post',
            url: `http://localhost:5000/posts`,
            data: {
                ...postData,
                created_at: moment(new Date()).format(),
            },
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        postData.content &&
            axios(configuration)
                .then((result) => {
                    navigate('/posts', { replace: true });
                })
                .catch((error) => {
                    error = new Error();
                });
    };

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            ['link', 'image'],
            ['clean'],
        ],
    };

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
    ];

    return (
        <>
            <div
                className={cx('wrapper')}
                style={{ backgroundImage: `url(${require('../../assets/images/post_bg2.jpg')})` }}
            >
                <PageHeader
                    title="Add Post"
                    icon={
                        <img
                            style={{ height: '54px', width: '54px' }}
                            src={require('../../assets/images/add_post_icon.png')}
                        />
                    }
                />
                <div className={cx('container')}>
                    <ReactQuill
                        className={'quill-container'}
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        value={postData.content || ''}
                        onChange={(e) => {
                            setPostData((prev) => {
                                return { ...prev, content: e };
                            });
                        }}
                    />
                    <div className={cx('footer')}>
                        <Button
                            className={cx('submit-btn')}
                            title="Submit"
                            onClick={() => setIsShowConfirmBox(true)}
                            primary
                            icon={<FontAwesomeIcon icon={faPaperPlane} />}
                        />
                    </div>
                </div>
            </div>
            {isShowConfirmBox && (
                <ConfirmBox
                    content={'Do you really want to add this post?'}
                    onAprrove={() => {
                        setIsShowConfirmBox(false);
                        handleSubmit();
                    }}
                    onReject={() => {
                        setIsShowConfirmBox(false);
                    }}
                />
            )}
        </>
    );
}

export default AddPost;
