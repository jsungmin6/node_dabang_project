const express = require("./config/express");
const { logger } = require("./config/winston");
const dotenv = require('dotenv');
dotenv.config();

const port = 80;
express().listen(port)
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
