const employeesRouter = require("./employees");
const postsRouter = require("./posts");
const calendarsRouter = require("./calendars");
const requestsRouter = require("./requests");
const departmentsRouter = require("./departments");
const documentsRouter = require("./documents");
const authRouter = require("./auth");

function route(app) {
  app.use("/employees", employeesRouter);
  app.use("/posts", postsRouter);
  app.use("/calendars", calendarsRouter);
  app.use("/requests", requestsRouter);
  app.use("/departments", departmentsRouter);
  app.use("/documents", documentsRouter);
  app.use("/auth", authRouter);
}

module.exports = route;
