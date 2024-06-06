const db = require('../../config/db');

class PostController {
    getAllPost(req, res) {
        const user = req.userInfo;
        db.query(
            `SELECT * FROM post 
        LEFT JOIN employee
        ON post.creator_id = employee.emp_id
        LEFT JOIN department
        ON post.dep_id = department.dep_id
        ${!user?.dep_id ? '' : `WHERE post.dep_id = ${user?.dep_id} OR  post.dep_id is null`}
        `,
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(result);
                }
            },
        );
    }

    getDetailPost(req, res) {
        const { postId } = req.params;

        db.query(
            `SELECT * FROM post
          WHERE post_id = ${postId}`,
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.send(result);
                }
            },
        );
    }

    addPost(req, res) {
        const user = req.userInfo;
        const { content, created_at } = req.body;

        const sql = `INSERT INTO post (creator_id, dep_id, content, created_at) VALUES 
    (${user?.emp_id}, ${user?.dep_id}, '${content}', '${created_at}')`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    updatePost(req, res) {
        const user = req.userInfo;
        const { post_id, content } = req.body;

        const sql = `UPDATE post
        SET 
          content = '${content}'
        WHERE post_id = ${post_id} and creator_id = ${user?.emp_id}`;

        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        });
    }

    searchPost(req, res) {
        const user = req.userInfo;
        const { search_value } = req.query;

        const promise = () => {
            const sql = `SELECT * FROM post 
          LEFT JOIN employee
          ON post.creator_id = employee.emp_id
          LEFT JOIN department
          ON post.dep_id = department.dep_id
          WHERE content LIKE '%${search_value}%'
          ${!user?.dep_id ? '' : `AND post.dep_id = ${user?.dep_id} OR  post.dep_id is null`}
          `;

            return new Promise((resolve, rejece) => {
                db.query(sql, (err, result) => {
                    if (err) {
                        rejece(err);
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

    deletePost(req, res) {
        const user = req.userInfo;
        const { post_id } = req.body;

        const sql = `
        DELETE FROM post WHERE post_id = ${post_id} AND creator_id = ${user?.emp_id}
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

module.exports = new PostController();
