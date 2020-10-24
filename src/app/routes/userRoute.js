module.exports = function (app) {
  const user = require("../controllers/userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");
  const passport = require('passport');

  app.route("/app/signUp").post(user.signUp);
  app.route("/app/signIn").post(user.signIn);

  app.get("/check", jwtMiddleware, user.check);
  app.get("/logIn/kakao/callback", user.kakaoSignIn);
  app.get('/kakao', user.kakao);
  // app.get('/facebook', user.facebook);
  // // app.get('/oauth/facebook/callback', user.facebookSingIn);
  app.get('/auth/google', user.google);
  app.get('/auth/google/callback', user.googleSingIn);
};
