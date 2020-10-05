module.exports = function (app) {
  const test = require("../controllers/testController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");
  app.get("/test", test.practice);
  app.get("/test/interest-regions", test.interest);
  app.route("/test/userCreat").post(test.userCreat);
};
