const db = require("../config/db");

module.exports = async (req, res, next) => {
  const { role } = req.user;

  if (role == "Director") {
    next();
  } else {
    res.status(401).json({
      error: new Error("Invalid req!"),
    });
  }
};
