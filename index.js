const express = require("./config/express");
const { logger } = require("./config/winston");
const dotenv = require('dotenv');
dotenv.config();
const webSoket = require('./socket')

const port = 3000;
const server = express().listen(port)
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);

webSoket(server);