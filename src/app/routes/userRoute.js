module.exports = function (app) {
  const user = require("../controllers/userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");
  const passport = require('passport');

  app.route("/app/signUp").post(user.signUp);
  app.route("/app/signIn").post(user.signIn);

  app.get("/check", jwtMiddleware, user.check);
  app.route("/logIn/kakao/callback").post(user.kakaoSignIn);
  app.get('/kakao', user.kakao);
};
