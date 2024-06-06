const db = require('../../config/db');

class CalendarController {
    getAllCalendar(req, res) {
        const user = req.userInfo;

        let sql = '';

        if (user?.role == 'Director') {
            sql = `SELECT * FROM calendar`;
        } else {
            sql = `SELECT * FROM calendar WHERE dep_id = ${user?.dep_id} or dep_id is null`;
        }

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    getCalendar(req, res) {
        const user = req.userInfo;
        const { cal_id } = req.query;

        const sql = `SELECT * FROM calendar WHERE cal_id = ${cal_id}`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    getCalendarRequests(req, res) {
        const user = req.userInfo;

        let sql = `
      SELECT * FROM calendar_request
      INNER JOIN employee
      ON calendar_request.creator_id = employee.emp_id`;

        if (user?.role === 'Director') {
            sql = `
      SELECT * FROM calendar_request
      INNER JOIN employee
      ON calendar_request.creator_id = employee.emp_id`;
        } else if (user?.role === 'Manager') {
            sql = `
        SELECT * FROM calendar_request
        INNER JOIN employee
        ON calendar_request.creator_id = employee.emp_id
        WHERE creator_id = ${user?.emp_id}`;
        }

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    getCalendarRequest(req, res) {
        const user = req.userInfo;

        const { cal_req_id } = req.query;

        if (user?.role !== 'Manager' || !cal_req_id) {
            return;
        }

        let sql = `
      SELECT * FROM calendar_request
      WHERE calendar_request.cal_req_id = ${cal_req_id} and calendar_request.creator_id = ${user?.emp_id}
      `;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    postCalendar(req, res) {
        const { cal_id, cal_req_id, status, creator_id, start_date, end_date, content, created_at, room, dep_id } =
            req.body;

        const user = req.userInfo;

        if (creator_id == user?.emp_id && user?.role == 'Director') {
            const sql = `insert into calendar (creator_id, start_date, end_date, content, created_at, room) values
          (${user?.emp_id}, '${start_date}', '${end_date}', '${content}', '${created_at}', '${room}')`;

            db.query(sql, (err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    res.send(result);
                }
            });
        } else {
            const promise = () => {
                const sql = `
        UPDATE calendar_request
        SET	status = ${status}
        WHERE cal_req_id = ${cal_req_id}`;

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
    }

    postCalendarRequest(req, res) {
        const user = req.userInfo;

        const { room, content, start_date, end_date, created_at, dep_id } = req.body;

        db.query(
            `INSERT INTO calendar_request (creator_id, start_date, end_date, content, created_at, status, room, dep_id) VALUES
       (${user?.emp_id}, '${start_date}', '${end_date}', '${content}', '${created_at}', 0, '${room}', ${dep_id})`,
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(result);
                }
            },
        );
    }

    updateCalendar(req, res) {
        const user = req.userInfo;
        const { cal_id, room, content, start_date, end_date } = req.body;

        const sql = `
    UPDATE calendar
    SET	
    room = '${room}',
    content = '${content}',
    start_date = '${start_date}',
    end_date = '${end_date}'
    WHERE cal_id = ${cal_id}`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    updateCalendarRequest(req, res) {
        const user = req.userInfo;
        const { cal_req_id, room, content, start_date, end_date } = req.body;

        const sql = `
    UPDATE calendar_request
    SET	
    room = '${room}',
    content = '${content}',
    start_date = '${start_date}',
    end_date = '${end_date}'
    WHERE cal_req_id = ${cal_req_id} and status = 0`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    deleteCalendar(req, res) {
        const user = req.userInfo;
        const { cal_id } = req.body;

        if (user?.role !== 'Director') {
            return;
        }

        const sql = `
        DELETE FROM calendar WHERE cal_id = ${cal_id}
    `;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    deleteCalendarRequest(req, res) {
        const user = req.userInfo;
        const { cal_req_id } = req.body;

        const sql = `
        DELETE FROM calendar_request WHERE cal_req_id = ${cal_req_id} and creator_id = ${user?.emp_id}
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

module.exports = new CalendarController();
