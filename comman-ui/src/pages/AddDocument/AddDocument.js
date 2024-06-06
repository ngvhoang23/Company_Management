import classNames from 'classnames/bind';
import styles from './AddDocument.module.scss';
import PageHeader from '../components/PageHeader/PageHeader';
import { useRef, useState } from 'react';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { useEffect } from 'react';
import ConfirmBox from '~/components/ConfirmBox/ConfirmBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button/Button';
import Cookies from 'universal-cookie';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function AddDocument() {
    const user = JSON.parse(localStorage.getItem('USER_INFO'));

    const navigate = useNavigate();

    const fileInpRef = useRef(null);

    const [docData, setDocData] = useState({
        doc_name: '',
    });

    const [file, setFile] = useState({});
    const [isShowConfirmBox, setIsShowConfirmBox] = useState(false);

    const handleSubmit = () => {
        if (!docData.doc_name) {
            alert('You must fill in all the required fields.');
            return;
        }

        const formData = new FormData();

        formData.append('docData', JSON.stringify(docData));
        formData.append('document', file);

        const config = {
            headers: { 'content-type': 'multipart/form-data' },
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };

        docData.doc_name &&
            axios
                .post(`http://localhost:5000/documents`, formData, config)
                .then((result) => {
                    navigate('/documents', { replace: true });
                })
                .catch((error) => {
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
                    title="Add Document"
                    icon={
                        <img
                            style={{ height: '54px', width: '54px' }}
                            src={require('../../assets/images/folder_plus_icon.png')}
                        />
                    }
                />
                <div className={cx('container')}>
                    <div className={cx('input-box')}>
                        <span className={cx('input-label')}>Document title*</span>
                        <input
                            value={docData.room}
                            placeholder="Document title*"
                            onChange={(e) =>
                                setDocData((prev) => {
                                    return { ...prev, doc_name: e.target.value };
                                })
                            }
                        />
                    </div>

                    <div className={cx('input-box', 'upload-img-area')}>
                        <Button
                            className={cx('select-file-btn')}
                            title="Choose file"
                            onClick={() => fileInpRef.current.click()}
                            primary
                        />
                        <p className={cx('file-name')}>{file?.name || 'or drag and drop file here'}</p>
                        <input
                            ref={fileInpRef}
                            className={cx('file-input')}
                            type="file"
                            accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                            onChange={(e) => {
                                setFile(e.target.files[0]);
                            }}
                            spellCheck={false}
                        />
                    </div>

                    <div className={cx('footer')}>
                        <Button
                            className={cx('submit-btn')}
                            title="Submit"
                            onClick={() => setIsShowConfirmBox(true)}
                            primary
                        />
                    </div>
                </div>
            </div>
            {isShowConfirmBox && (
                <ConfirmBox
                    content={'Do you really want to add this document?'}
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

export default AddDocument;
