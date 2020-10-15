const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const { pool } = require("../config/database");



module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: 'http://localhosts:3000/logIn/kakao/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        const userEmail = profile._json.kakao_account.email
        try {
            const connection = await pool.getConnection(async (conn) => conn);
            try {
                const isVaildUserInfoQuery = `
                        SELECT * FROM User WHERE userEmail= ?
                      `;
                const isVaildUserInfoParams = [userEmail];
                const [userInfoRows] = await connection.query(isVaildUserInfoQuery, isVaildUserInfoParams);
                console.log(userInfoRows)

                done(null, userInfoRows)
            }
            catch (err) {
                await connection.rollback(); // ROLLBACK
                connection.release();
                logger.error(`App - SignUp Query error\n: ${err.message}`);
                return res.status(500).send(`Error: ${err.message}`);
            }
        } catch (err) {
            logger.error(`App - SignUp DB Connection error\n: ${err.message}`);
            return res.status(500).send(`Error: ${err.message}`);
        }
    }));
};
