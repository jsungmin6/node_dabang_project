const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, 'html')));

exports.main = async function (req, res) {
  res.sendFile(path.join(__dirname, 'html', 'main.html'));
};


exports.practice = async function (req, res) {
  console.log("GET 메소드를 사용하느 /test 라우팅 연결이 성공하였습니다.");
  res.json({
    message: "GET 메소드를 사용하느 /test 라우팅 연결이 성공하였습니다.",
  });
};

exports.interest = async function (req, res) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const [rows] = await connection.query(
        `
            SELECT * FROM User
            `
      );
      connection.release();
      return res.json(rows);
    } catch (err) {
      logger.error(
        `example non transaction Query error\n: ${JSON.stringify(err)}`
      );
      connection.release();
      return false;
    }
  } catch (err) {
    logger.error(
      `example non transaction DB Connection error\n: ${JSON.stringify(err)}`
    );
    return false;
  }
};

exports.userCreat = async function (req, res) {
  const { userName, userEmail, userPwd, userPwdCheck, userPhone } = req.body;
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      const insertUserInfoQuery = `
              INSERT INTO User (userName, userEmail, userPwd, userPhone) VALUES (?, ? ,?, ?);
              `;
      const insertUserInfoParams = [userName, userEmail, userPwd, userPhone];
      await connection.query(insertUserInfoQuery, insertUserInfoParams);

      await connection.commit(); // COMMIT
      connection.release();
      return res.json({
        isSuccess: true,
        code: 200,
        message: "회원가입 성공",
      });
    } catch (err) {
      await connection.rollback(); // ROLLBACK
      connection.release();
      logger.error(`App - SignUp Query error\n: ${err.message}`);
      return res.status(500).send(`Error: ${err.message}`);
    }
  } catch (err) {
    logger.error(`App - SignUp DB Connection error\n: ${err.message}`);
    return res.status(500).send(`Error: ${err.message}`);
  }
};
