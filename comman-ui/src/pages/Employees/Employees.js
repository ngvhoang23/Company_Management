import classNames from 'classnames/bind';
import styles from './Employees.module.scss';
import PageHeader from '../components/PageHeader/PageHeader';
import EmployeeItem from './EmployeeItem';
import PopperWrapper from '~/components/PopperWrapper/PopperWrapper';
import Popper from '~/components/Popper/Popper';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ConfirmBox from '~/components/ConfirmBox/ConfirmBox';
import Cookies from 'universal-cookie';

const cx = classNames.bind(styles);

const cookies = new Cookies();

function Employees() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('USER_INFO'));

    const [employees, setEmployees] = useState([]);
    const [isShowConfirmBox, setIsShowConfirmBox] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchedEmps, setSearchedEmps] = useState();

    const fetchEmployees = () => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/employees`,
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

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fields = [
        { name: 'Avatar', ratio: 3 },
        { name: 'Name', ratio: 8 },
        { name: 'Department', ratio: 5 },
        { name: 'Role', ratio: 5 },
        { name: 'Degree', ratio: 5 },
        { name: 'Mobile', ratio: 5 },
        { name: 'Email', ratio: 10 },
        { name: 'Joining Date', ratio: 5 },
    ];

    if (user?.role === 'Director' || user?.role === 'Manager') {
        fields.push({ name: 'Actions', ratio: 5 });
    }

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

    const handleSearch = (search_value) => {
        const configuration = {
            method: 'get',
            url: `http://localhost:5000/employees/searching/${search_value}`,
            params: {
                search_value,
            },
            headers: { Authorization: `Bearer ${cookies.get('access_token')}` },
        };
        axios(configuration)
            .then((result) => {
                setSearchedEmps(result.data);
            })
            .catch((error) => {
                error = new Error();
                console.log(error);
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
                    title={searchedEmps ? 'Employees/Search' : 'Employees'}
                    icon={
                        <img
                            style={{ height: '54px', width: '54px' }}
                            src={require('../../assets/images/employees_icon.png')}
                        />
                    }
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    onSearch={() => {
                        handleSearch(searchValue);
                    }}
                    onClick={() => {
                        fetchEmployees();
                        setSearchedEmps();
                        setSearchValue('');
                    }}
                />
                <div className={cx('container')}>
                    <PopperWrapper
                        title="Employeess"
                        fields={fields}
                        onAddNew={() => {
                            navigate(`/employees/add-employee`, { replace: true });
                        }}
                        onReload={() => fetchEmployees()}
                        icon={
                            <img
                                style={{ height: '30px', width: '30px', marginRight: '8px' }}
                                src={require('../../assets/images/employees_icon.png')}
                            />
                        }
                    >
                        {!searchedEmps
                            ? employees.map((emp) => (
                                  <EmployeeItem
                                      onClick={() => {
                                          navigate(`/profile/${emp.emp_id}`, { replace: true });
                                      }}
                                      key={emp.emp_id}
                                      className={cx('employee-item', 'border-top')}
                                      emp={emp}
                                      onEditEmployee={() => {
                                          navigate(`/employees/edit-employee/${emp.emp_id}`, { replace: true });
                                      }}
                                      onDeleteEmployee={() => setIsShowConfirmBox(emp.emp_id)}
                                  />
                              ))
                            : searchedEmps.map((emp) => (
                                  <EmployeeItem
                                      onClick={() => {
                                          navigate(`/profile/${emp.emp_id}`, { replace: true });
                                      }}
                                      key={emp.emp_id}
                                      className={cx('employee-item', 'border-top')}
                                      emp={emp}
                                      onEditEmployee={() => {
                                          navigate(`/employees/edit-employee/${emp.emp_id}`, { replace: true });
                                      }}
                                      onDeleteEmployee={() => setIsShowConfirmBox(emp.emp_id)}
                                  />
                              ))}
                    </PopperWrapper>
                </div>
            </div>
            {isShowConfirmBox && (
                <ConfirmBox
                    content={'Do you really want to delete this employee?'}
                    onAprrove={() => {
                        setIsShowConfirmBox(false);
                        handleDeleteEmployee(isShowConfirmBox);
                    }}
                    onReject={() => {
                        setIsShowConfirmBox(false);
                    }}
                />
            )}
        </>
    );
}

export default Employees;
