const db = require('../../config/db');
const bcrypt = require('bcrypt');

class EmployeeController {
    getAllEmployee(req, res) {
        const user = req.userInfo;

        db.query(
            `SELECT * FROM employee
        INNER JOIN department
        ON employee.dep_id = department.dep_id
        ${!user?.dep_id ? '' : `WHERE employee.dep_id = ${user?.dep_id} AND employee.emp_id <> ${user?.emp_id}`}`,
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    res.send(result);
                }
            },
        );
    }

    searchEmployees(req, res) {
        const user = req.userInfo;
        const { search_value } = req.query;

        db.query(
            `SELECT * FROM employee
        INNER JOIN department
        ON employee.dep_id = department.dep_id
        WHERE employee.emp_name LIKE '%${search_value}%'
        ${!user?.dep_id ? '' : `AND employee.dep_id = ${user?.dep_id} AND employee.emp_id <> ${user?.emp_id}`}`,
            (err, result) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    res.send(result);
                }
            },
        );
    }

    getEmployeeInfo(req, res) {
        const user = req.userInfo;
        const { emp_id } = req.query;

        const promise = () => {
            return new Promise((resolve, reject) => {
                let sql = '';

                if (user?.role === 'Director') {
                    sql = `SELECT employee.*, department.dep_name FROM employee
          LEFT JOIN  department
          ON employee.dep_id = department.dep_id
          WHERE emp_id = ${emp_id}`;
                } else {
                    sql = `SELECT employee.*, department.dep_name FROM employee
          LEFT JOIN  department
          ON employee.dep_id = department.dep_id
          WHERE emp_id = ${emp_id} and department.manager_id = ${user?.emp_id}`;
                }

                db.query(sql, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0]);
                    }
                });
            });
        };

        promise()
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.log(err);
                res.send(err);
            });
    }

    getIndividualInfo(req, res) {
        const user = req.userInfo;

        const sql = `SELECT * FROM employee
            LEFT JOIN department
            ON employee.dep_id = department.dep_id
            where employee.emp_id = ${user.emp_id} and (department.dep_id = ${user.dep_id} || department.dep_id is null)`;
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    getAllManager(req, res) {
        const user = req.userInfo;

        let sql = '';

        if (user?.role == 'Director') {
            return;
        } else {
            sql = `SELECT * FROM employee
      LEFT JOIN department
      ON employee.dep_id = department.dep_id
      WHERE (employee.role = "Manager" or employee.dep_id is null) AND employee.emp_id <> ${user?.emp_id}`;
        }

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    postEmployee(req, res) {
        const {
            phone_num,
            emp_name,
            sex,
            role,
            user_name,
            password,
            salary,
            email,
            dep_id,
            birth_date,
            joining_date,
            about,
            degree,
            education,
            experience,
            address,
            citizen_identification,
        } = JSON.parse(req.body.userData);

        const user = req.userInfo;

        const hashPassword = (password) => {
            return new Promise((resolve, reject) => {
                bcrypt.hash(password, 10, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        const promise = (hashed_password) => {
            return new Promise((resolve, reject) => {
                let imgsrc = 'http://127.0.0.1:5000/user_avatars/' + req.file?.filename;

                if (!req.file) {
                    imgsrc = 'http://127.0.0.1:5000/user_avatars/User-avatar.svg.png';
                }

                const data = [
                    [
                        citizen_identification,
                        emp_name,
                        role,
                        address,
                        phone_num,
                        birth_date,
                        sex,
                        salary,
                        user_name,
                        hashed_password,
                        imgsrc,
                        degree,
                        email,
                        joining_date,
                        about,
                        education,
                        experience,
                        dep_id,
                    ],
                ];

                const query = `INSERT INTO employee (citizen_identification, emp_name, role, address, phone_num, birth_date, sex, salary, user_name, password, avatar, degree, email, joining_date, about, education, experience, dep_id) VALUES ?;`;

                db.query(query, [data], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        hashPassword(password)
            .then((hashed_password) => {
                return promise(hashed_password);
            })
            .then((result) => {
                return new Promise((resolve, reject) => {
                    if (role === 'Manager') {
                        const sql = `
              UPDATE department
                SET manager_id = ${result.insertId}
                WHERE dep_id = ${dep_id}`;
                        db.query(sql, (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        });
                    } else {
                        resolve(result);
                    }
                });
            })
            .then((result) => {
                res.status(200).send('Successfully!!!');
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send(err);
            });
    }

    updateEmployee(req, res) {
        const {
            emp_id,
            phone_num,
            emp_name,
            sex,
            role,
            salary,
            email,
            dep_id,
            birth_date,
            joining_date,
            about,
            degree,
            education,
            experience,
            address,
        } = JSON.parse(req.body.userData);

        const user = req.userInfo;

        const promise = () => {
            return new Promise((resolve, reject) => {
                const imgsrc = 'http://127.0.0.1:5000/user_avatars/' + req.file?.filename;

                const query = `
        UPDATE employee
          SET
            emp_name = '${emp_name}',
            role = '${role}',
            address = '${address}',
            phone_num = '${phone_num}',
            birth_date = '${birth_date}',
            sex = ${sex},
            salary = ${salary},
            ${req.file ? `avatar = '${imgsrc}',` : ''}
            degree = '${degree}',
            email = '${email}',
            joining_date = '${joining_date}',
            about = '${about}',
            education = '${education}',
            experience = '${experience}',
            dep_id = '${dep_id}'
          WHERE 
            emp_id = '${emp_id}';
            ${
                role === 'Manager'
                    ? `UPDATE department 
              SET 
                manager_id = ${emp_id}
              WHERE
                dep_id = ${dep_id}    
            `
                    : ''
            }
             `;
                db.query(query, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        promise()
            .then((result) => {
                res.status(200).send(result);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send(err);
            });
    }

    getEmployeeByDepartment(req, res) {
        const user = req.userInfo;

        const { dep_id } = req.query;

        db.query(
            `SELECT * FROM employee
        LEFT JOIN department
        ON employee.dep_id = department.dep_id
        ${!dep_id ? 'WHERE employee.dep_id is null' : `WHERE employee.dep_id = ${dep_id}`}`,
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(result);
                }
            },
        );
    }

    updatePersonalProfile(req, res) {
        const user = req.userInfo;

        const {
            sex,
            salary,
            role,
            phone_num,
            joining_date,
            experience,
            emp_name,
            email,
            education,
            degree,
            citizen_identification,
            birth_date,
            address,
            about,
        } = JSON.parse(req.body.userData);
        const imgsrc = 'http://127.0.0.1:5000/user_avatars/' + req.file?.filename;

        let sql = `
    UPDATE employee
    SET
      address = '${address}',
      phone_num = '${phone_num}',
      birth_date = '${birth_date}',
      ${req.file ? `avatar = '${imgsrc}',` : ''}
      email = '${email}'
    WHERE 
      emp_id = ${user?.emp_id}`;

        if (user.role == 'Director') {
            sql = `
      UPDATE employee
      SET
        citizen_identification = '${citizen_identification}',
        phone_num = '${phone_num}',
        emp_name = '${emp_name}',
        sex = ${sex},
        salary = ${salary},
        address = '${address}',
        birth_date = '${birth_date}',
        about = '${about}',
        degree = '${degree}',
        education = '${education}',
        experience = '${experience}',
        joining_date = '${joining_date}',
        ${req.file ? `avatar = '${imgsrc}',` : ''}
        email = '${email}'
      WHERE 
        emp_id = ${user?.emp_id}`;
        }

        const promise = () => {
            return new Promise((resolve, reject) => {
                db.query(sql, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        promise()
            .then((result) => {
                res.send(result);
            })
            .catch((err) => {
                console.log(err);
                res.send(err);
            });
    }

    deleteEmployee(req, res) {
        const user = req.userInfo;
        const { emp_id } = req.body;

        if (user?.role !== 'Director' && user?.role !== 'Manager') {
            return;
        }

        let sql = `
        DELETE FROM employee WHERE emp_id = ${emp_id} AND dep_id = ${user?.dep_id}
    `;

        if (user?.role === 'Director') {
            sql = `DELETE FROM employee WHERE emp_id = ${emp_id}`;
        }

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    changePasswordByAdmin(req, res) {
        const { password, emp_id } = req.body;
        const hashPassword = (password) => {
            return new Promise((resolve, reject) => {
                bcrypt.hash(password, 10, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        const promise = (hashed_password) => {
            const sql = `update employee set password = ? where emp_id = ${emp_id}`;
            const data = [hashed_password];
            return new Promise((resolve, reject) => {
                db.query(sql, data, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        hashPassword(password)
            .then((hashed_password) => {
                return promise(hashed_password);
            })
            .then((result) => {
                res.status(200).send(result);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send(err);
            });
    }

    changePassword(req, res) {
        const { emp_id } = req.userInfo;
        const { old_password, new_password } = req.body;

        const getPassword = () => {
            return new Promise((resolve, reject) => {
                db.query(`select * from employee where emp_id = ${emp_id}`, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (result?.length == 0) {
                            reject('Token Invalid');
                        } else {
                            resolve(result[0]?.password);
                        }
                    }
                });
            });
        };

        const checkPassword = (password) => {
            return new Promise((resolve, reject) => {
                bcrypt.compare(old_password, password).then((result) => {
                    if (result) {
                        resolve(1);
                    } else {
                        reject('Wrong Password');
                    }
                });
            });
        };

        const hashPassword = (password) => {
            return new Promise((resolve, reject) => {
                bcrypt.hash(password, 10, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        const promise = (hashed_password) => {
            const sql = `update employee set password = ?`;
            const data = [hashed_password];
            return new Promise((resolve, reject) => {
                db.query(sql, data, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };

        getPassword()
            .then((password) => {
                return checkPassword(password);
            })
            .then((result) => {
                return hashPassword(new_password);
            })
            .then((hashed_password) => {
                return promise(hashed_password);
            })
            .then((result) => {
                res.status(200).send(result);
            })
            .catch((err) => {
                console.log(err);
                res.status(400).send(err);
            });
    }
}

module.exports = new EmployeeController();
