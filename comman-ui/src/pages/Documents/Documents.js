import classNames from 'classnames/bind';
import styles from './Documents.module.scss';

import PageHeader from '../components/PageHeader/PageHeader';
import DocumentItem from '~/components/DocumentItem/DocumentItem';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getExtension } from '~/userDefineFunction';
import Cookies from 'universal-cookie';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function Documents() {
    const user = JSON.parse(localStorage.getItem('USER_INFO'));
    const navigate = useNavigate();

    const [docs, setDocs] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [searchedDoc, setSearchedDoc] = useState();

    const fetchDocuments = () => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/documents`,
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        axios(configuration)
            .then((result) => {
                setDocs(result.data);
            })
            .catch((error) => {
                error = new Error();
            });
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleRemoveDocument = (doc_id) => {
        const configuration = {
            method: 'delete',
            url: `http://localhost:5000/documents/${doc_id}`,
            params: {
                doc_id,
            },
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        axios(configuration)
            .then((result) => {
                fetchDocuments();
            })
            .catch((error) => {
                error = new Error();
            });
    };

    const handleSearch = (search_value) => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/documents/searching/${search_value}`,
            params: {
                search_value,
            },
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        axios(configuration)
            .then((result) => {
                setSearchedDoc(result.data);
            })
            .catch((error) => {
                error = new Error();
                console.log(error);
            });
    };

    return (
        <div
            className={cx('wrapper')}
            style={{ backgroundImage: `url(${require('../../assets/images/post_bg2.jpg')})` }}
        >
            <PageHeader
                is_search
                title={searchedDoc ? 'Documents/Search' : 'Documents'}
                icon={
                    <img
                        style={{ height: '54px', width: '54px' }}
                        src={require('../../assets/images/folder_icon.png')}
                    />
                }
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                onSearch={() => {
                    handleSearch(searchValue);
                }}
                onClick={() => {
                    fetchDocuments();
                    setSearchedDoc();
                    setSearchValue('');
                }}
            />
            <div className={cx('container')}>
                {!searchedDoc
                    ? docs.map((doc) => (
                          <DocumentItem
                              key={doc.doc_id}
                              className={cx('doc-item')}
                              title={doc.doc_name}
                              src={doc.content}
                              file_name={doc.file_name}
                              type={getExtension(doc.file_name)}
                              onRemoveDocument={() => handleRemoveDocument(doc.doc_id)}
                          />
                      ))
                    : searchedDoc.map((doc) => (
                          <DocumentItem
                              key={doc.doc_id}
                              className={cx('doc-item')}
                              title={doc.doc_name}
                              src={doc.content}
                              file_name={doc.file_name}
                              type={getExtension(doc.file_name)}
                              onRemoveDocument={() => handleRemoveDocument(doc.doc_id)}
                          />
                      ))}
            </div>
        </div>
    );
}

export default Documents;
