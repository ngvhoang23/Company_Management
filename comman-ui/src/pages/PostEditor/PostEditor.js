import classNames from 'classnames/bind';
import styles from './PostEditor.module.scss';
import PageHeader from '../components/PageHeader/PageHeader';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ConfirmBox from '~/components/ConfirmBox/ConfirmBox';
import Cookies from 'universal-cookie';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function PostEditor() {
    const user = JSON.parse(localStorage.getItem('USER_INFO'));

    const navigate = useNavigate();

    const { postId } = useParams();

    const [isShowConfirmBox, setIsShowConfirmBox] = useState(false);

    const [postData, setPostData] = useState({});

    useEffect(() => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/posts/${postId}`,
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        postId &&
            axios(configuration)
                .then((result) => {
                    setPostData(result.data[0]);
                })
                .catch((error) => {
                    error = new Error();
                });
    }, [postId]);

    const handleSubmit = () => {
        const configuration = {
            method: 'put',
            url: `http://localhost:5000/posts/${postId}`,
            data: {
                ...postData,
            },
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        axios(configuration)
            .then((result) => {
                navigate('/posts', { replace: true });
            })
            .catch((error) => {
                error = new Error();
            });
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <PageHeader title="Edit Post" />
                <div className={cx('container')}>
                    <ReactQuill
                        theme="snow"
                        value={postData.content || ''}
                        onChange={(e) => {
                            setPostData((prev) => {
                                return { ...prev, content: e };
                            });
                        }}
                    />
                    <div className={cx('footer')}>
                        <button className={cx('submit-btn')} onClick={() => setIsShowConfirmBox(true)}>
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            {isShowConfirmBox && (
                <ConfirmBox
                    content={'Do you really want to edit this post?'}
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

export default PostEditor;
