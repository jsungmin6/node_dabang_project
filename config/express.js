const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
var cors = require("cors");
const passport = require('passport')
const passportConfig = require('../passport')
// const fs = require('fs');
// const key = fs.readFileSync('./keys/key.pem');
// const cert = fs.readFileSync('./keys/my-pubcert.pem');
// const https = require('https');


module.exports = function () {
  const app = express();
  // const server = https.createServer({ key: key, cert: cert }, app);

  passportConfig()

  app.use(compression());

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use(methodOverride());

  app.use(cors());
  // app.use(express.static(process.cwd() + '/public'));

  /* App (Android, iOS) */
  require("../src/app/routes/indexRoute")(app);
  require("../src/app/routes/userRoute")(app);
  require("../src/app/routes/testRoute")(app);
  require("../src/app/routes/homeRoute")(app);

  /* Web */
  // require('../src/web/routes/indexRoute')(app);

  /* Web Admin*/
  // require('../src/web-admin/routes/indexRoute')(app);

  return app;
};
