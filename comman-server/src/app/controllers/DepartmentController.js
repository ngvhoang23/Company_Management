const db = require("../../config/db");

class DepartmentController {
  getAllDepartment(req, res) {
    db.query(`SELECT * FROM department`, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(result);
      }
    });
  }
}

module.exports = new DepartmentController();
