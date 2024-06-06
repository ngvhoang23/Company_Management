const db = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginController {
    access(req, res) {
        const { user_name, password } = req.body;

        db.query(`SELECT * FROM employee WHERE user_name = '${user_name}'`, (err, result) => {
            if (err || result.length == 0) {
                res.status(404).send({
                    message: 'Login Fail :((',
                    err,
                });
                console.log(err || 'Login Fail :((');
            } else {
                const user = result[0];
                const { emp_name, emp_id, role, dep_id } = user;
                bcrypt.compare(password, user?.password).then((result) => {
                    if (result) {
                        const access_token = jwt.sign(
                            {
                                emp_name,
                                emp_id,
                                role,
                                dep_id,
                            },
                            process.env.ACCESS_TOKEN_SECRET_KEY,
                            { expiresIn: process.env.ACCESS_TOKEN_DURATION },
                        );

                        res.status(200).send({
                            message: 'Login Successful',
                            user,
                            access_token,
                        });
                    } else {
                        res.status(404).send({
                            message: 'Login Fail :((',
                            err,
                        });
                        console.log(err || 'Wrong Password');
                    }
                });
            }
        });
    }
}

module.exports = new LoginController();
