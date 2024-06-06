const db = require('../config/db');

module.exports = async (req, res, next) => {
    try {
        const { user_name, password } = req.query.user;

        db.query(
            `SELECT * FROM employee 
        WHERE user_name = '${user_name}' and password = '${password}'`,
            (err, result) => {
                if (err || result.length == 0) {
                    res.send('Failure!!!');
                } else {
                    req.user = result[0];
                    next();
                }
            },
        );
    } catch (error) {
        console.log('error', error);
        res.status(401).json({
            error: new Error('Invalid req!'),
        });
    }
};
