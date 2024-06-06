const db = require('../../config/db');

class DocumentController {
    getAllDocument(req, res) {
        const user = req.userInfo;

        const sql = `SELECT * FROM document WHERE post_id is null`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    searchDocument(req, res) {
        const user = req.userInfo;
        const { search_value } = req.query;

        const sql = `SELECT * FROM document WHERE post_id is null AND doc_name LIKE '%${search_value}%'`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    postDocument(req, res) {
        const user = req.userInfo;

        const { doc_name } = JSON.parse(req.body.docData);

        const docsrc = 'http://127.0.0.1:5000/documents/' + req.file?.filename;

        const sql = `INSERT INTO document (doc_name, content, creator_id, file_name) VALUES ('${doc_name}', '${docsrc}', ${user?.emp_id}, '${req.file?.filename}')`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    deleteDocument(req, res) {
        const user = req.userInfo;

        if (user?.role !== 'Director') {
            return;
        }

        const { doc_id } = req.query;

        const sql = `DELETE FROM document WHERE doc_id = ${doc_id}`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }
}

module.exports = new DocumentController();
