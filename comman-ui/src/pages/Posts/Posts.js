import classNames from 'classnames/bind';
import styles from './Posts.module.scss';
import PostItem from '~/components/PostItem/PostItem';
import PageHeader from '../components/PageHeader/PageHeader';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmBox from '~/components/ConfirmBox/ConfirmBox';
import { IsLoadingContext } from '~/Context/LoadingContext';
import { ConfirmContext } from '~/Context/ConfirmContext';
import { ResultStatusContext } from '~/Context/ResultStatusContext';
import Cookies from 'universal-cookie';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function Posts() {
    const user = JSON.parse(localStorage.getItem('USER_INFO'));

    const isLoadingContext = useContext(IsLoadingContext);
    const setIsLoading = isLoadingContext.setIsLoading;

    const confirmContext = useContext(ConfirmContext);
    const setConfirmFunc = confirmContext.setConfirmFunc;

    const resultStatusContext = useContext(ResultStatusContext);
    const resultStatus = resultStatusContext.status;
    const setResultStatus = resultStatusContext.setStatus;

    const [posts, setPosts] = useState([]);
    const [isShowConfirmBox, setIsShowConfirmBox] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchedPosts, setSearchPosts] = useState();

    const fetchPosts = () => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/posts/`,

            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };

        axios(configuration)
            .then((result) => {
                setPosts(result.data);
            })
            .catch((error) => {
                console.log(error);
                error = new Error();
            });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDeletePost = (post_id) => {
        setIsLoading(true);
        const configuration = {
            method: 'delete',
            url: `http://localhost:5000/posts/${post_id}`,
            data: {
                post_id,
            },
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };

        axios(configuration)
            .then((result) => {
                fetchPosts();
                setIsLoading(false);
                setResultStatus({ status: 1, message: 'Success' });
            })
            .catch((error) => {
                setIsLoading(false);
                setResultStatus({ status: 0, message: 'Fail :(' });
                error = new Error();
                console.log(error);
            });
    };

    const handleSearchPost = (search_value) => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/posts/searching/${search_value}`,
            params: {
                search_value,
            },
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };

        axios(configuration)
            .then((result) => {
                setSearchPosts(result.data);
            })
            .catch((error) => {
                console.log(error);
                error = new Error();
            });
    };

    return (
        <>
            <div
                className={cx('wrapper')}
                style={{ backgroundImage: `url(${require('../../assets/images/post_bg2.jpg')})` }}
            >
                <PageHeader
                    is_search
                    title={searchedPosts ? 'Posts/Search' : 'Posts'}
                    icon={
                        <img
                            style={{ height: '54px', width: '54px' }}
                            src={require('../../assets/images/posts_icon.png')}
                        />
                    }
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    onSearch={() => {
                        handleSearchPost(searchValue);
                    }}
                    onClick={() => {
                        fetchPosts();
                        setSearchPosts();
                        setSearchValue('');
                    }}
                />
                <div className={cx('container')}>
                    {!searchedPosts
                        ? posts.map((post) => (
                              <PostItem
                                  key={post.post_id}
                                  className={cx('post-item')}
                                  post={post}
                                  isOwner={user?.emp_id === post.creator_id}
                                  owner_role={post.role}
                                  onDeletePost={() => {
                                      setConfirmFunc({
                                          content: 'Do you really want to delete this post?',
                                          onAprrove: () => {
                                              handleDeletePost(post.post_id);
                                              setConfirmFunc();
                                          },
                                          onReject: () => {
                                              setConfirmFunc();
                                          },
                                      });
                                  }}
                              />
                          ))
                        : searchedPosts.map((post) => (
                              <PostItem
                                  key={post.post_id}
                                  className={cx('post-item')}
                                  post={post}
                                  isOwner={user?.emp_id === post.creator_id}
                                  owner_role={post.role}
                                  onDeletePost={() => {
                                      setConfirmFunc({
                                          content: 'Do you really want to delete this post?',
                                          onAprrove: () => {
                                              handleDeletePost(post.post_id);
                                              setConfirmFunc();
                                          },
                                          onReject: () => {
                                              setConfirmFunc();
                                          },
                                      });
                                  }}
                              />
                          ))}
                </div>
            </div>
        </>
    );
}

export default Posts;
