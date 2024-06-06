import classNames from 'classnames/bind';
import styles from './CompanyStructure.module.scss';
import PageHeader from '../components/PageHeader/PageHeader';
import StructureItem from './StructureItem';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function CompanyStructure() {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/departments`,
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        axios(configuration)
            .then((result) => {
                setDepartments(result.data);
            })
            .catch((error) => {
                console.log(error);
                error = new Error();
            });
    }, []);

    return (
        <div
            className={cx('wrapper')}
            style={{ backgroundImage: `url(${require('../../assets/images/post_bg2.jpg')})` }}
        >
            <PageHeader
                title="Company Structure"
                icon={
                    <img
                        style={{ height: '54px', width: '54px' }}
                        src={require('../../assets/images/organization_icon.png')}
                    />
                }
            />
            <div className={cx('container')}>
                <StructureItem className={cx('structure-item')} title="Director" dep_id={null} />

                {departments.map((department) => (
                    <StructureItem
                        key={department.dep_id}
                        className={cx('structure-item')}
                        title={department.dep_name}
                        dep_id={department.dep_id}
                    />
                ))}
            </div>
        </div>
    );
}

export default CompanyStructure;
