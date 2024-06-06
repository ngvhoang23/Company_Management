const db = require('../../config/db');

class RequestController {
    getAllRequest(req, res) {
        const user = req.userInfo;
        db.query(
            `SELECT * FROM request
        INNER JOIN employee
        ON request.creator_id = employee.emp_id
      WHERE creator_id = ${user?.emp_id} OR receiver_id = ${user?.emp_id}`,
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(result);
                }
            },
        );
    }

    getReceivedRequest(req, res) {
        const user = req.userInfo;

        if (user?.role !== 'Director' && user?.role !== 'Manager') {
            return;
        }

        db.query(
            `SELECT * FROM request
        INNER JOIN employee
        ON request.creator_id = employee.emp_id
      WHERE receiver_id = ${user?.emp_id}`,
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(result);
                }
            },
        );
    }

    getSentRequest(req, res) {
        const user = req.userInfo;

        db.query(
            `SELECT * FROM request
        INNER JOIN employee
        ON request.creator_id = employee.emp_id
      WHERE creator_id = ${user?.emp_id}`,
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(result);
                }
            },
        );
    }

    getRequest(req, res) {
        const { req_id } = req.query;
        db.query(
            `SELECT request.*, employee.emp_name as receiver_name FROM request
        INNER JOIN employee
        ON request.receiver_id = employee.emp_id
      WHERE req_id = ${req_id}`,
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(result);
                }
            },
        );
    }

    postRequest(req, res) {
        const user = req.userInfo;
        const { creator_id, receiver_id, req_type, content, created_at } = req.body;

        if (user?.role === 'Director') {
            return;
        }

        const sql = `INSERT INTO REQUEST (req_type, creator_id, receiver_id, status, content, created_at) VALUES
    ('${req_type}', '${creator_id}', '${receiver_id}', 0, '${content}', '${created_at}')`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    updateRequest(req, res) {
        const { req_id, req_type, receiver_id, content } = req.body;

        const sql = `
    UPDATE request
      SET
        req_type = '${req_type}',
        receiver_id = '${receiver_id}',
        content = '${content}'
      WHERE req_id = ${req_id} and status = 0
         `;
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    updateStatusRequest(req, res) {
        const { req_id, status } = req.query;
        const user = req.userInfo;

        if (user?.role !== 'Manager' && user?.role !== 'Director') {
            return;
        }

        const sql = `
    UPDATE request
      SET
        status = '${status}'
      WHERE req_id = ${req_id}
         `;
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    deleteRequest(req, res) {
        const user = req.userInfo;
        const { req_id } = req.body;

        const sql = `
        DELETE FROM request WHERE req_id = ${req_id} AND creator_id = ${user?.emp_id}
    `;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }
}

module.exports = new RequestController();
