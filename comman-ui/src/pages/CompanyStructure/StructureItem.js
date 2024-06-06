import classNames from 'classnames/bind';
import styles from './CompanyStructure.module.scss';
import PopperWrapper from '~/components/PopperWrapper/PopperWrapper';
import EmployeeItem from '../Employees/EmployeeItem';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserInfoContext } from '~/Context/UserInfoContext';
import Cookies from 'universal-cookie';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function StructureItem({ dep_id, title, className }) {
    const userInfoContext = useContext(UserInfoContext);
    const userInfo = userInfoContext.userInfo;
    const setUserInfo = userInfoContext.setUserInfo;

    const navigate = useNavigate();
    const fields = [
        { name: 'Image', ratio: 3 },
        { name: 'Name', ratio: 8 },
        { name: 'Department', ratio: 5 },
        { name: 'Role', ratio: 5 },
        { name: 'Degree', ratio: 5 },
        { name: 'Mobile', ratio: 5 },
        { name: 'Email', ratio: 10 },
        { name: 'Joining Date', ratio: 5 },
    ];

    if (userInfo?.role === 'Director' || (userInfo?.role === 'Manager' && dep_id === userInfo?.dep_id)) {
        fields.push({ name: 'Actions', ratio: 5 });
    }

    const [employees, setEmployees] = useState([]);

    const fetchEmployees = () => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/employees/by-department/${dep_id}`,
            params: {
                dep_id,
            },
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        axios(configuration)
            .then((result) => {
                setEmployees(result.data);
            })
            .catch((error) => {
                error = new Error();
            });
    };

    const handleDeleteEmployee = (emp_id) => {
        const configuration = {
            method: 'delete',
            url: `http://localhost:5000/employees/${emp_id}`,
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
            data: {
                emp_id,
            },
        };
        axios(configuration)
            .then((result) => {
                fetchEmployees();
            })
            .catch((error) => {
                error = new Error();
            });
    };

    useEffect(() => {
        fetchEmployees();
    }, []);
    return (
        <div className={cx('item-wrapper', { [className]: className })}>
            <PopperWrapper
                title={title}
                fields={fields}
                onAddNew={() => {
                    navigate(`/employees/add-employee`, { replace: true });
                }}
                onReload={fetchEmployees}
            >
                {employees.map((emp) => (
                    <EmployeeItem
                        key={emp.emp_id}
                        className={cx('employee-item', 'border-top')}
                        emp={emp}
                        onEditEmployee={() => {
                            if (userInfo?.emp_id === emp.emp_id) {
                                navigate(`/profile/edit-profile`, { replace: true });
                            } else {
                                navigate(`/employees/edit-employee/${emp.emp_id}`, { replace: true });
                            }
                        }}
                        onDeleteEmployee={handleDeleteEmployee}
                    />
                ))}
            </PopperWrapper>
        </div>
    );
}

export default StructureItem;
