module.exports = function (app) {
  const home = require("../controllers/homeController.js");
  const jwtMiddleware = require("../../../config/jwtMiddleware");
  app.get("/users/:userIdx/interest-regions", jwtMiddleware, home.homeRoomInterest);
  app.get("/users/:userIdx/interest-complexes", jwtMiddleware, home.homeComplexInterest);
};
