const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { pool } = require("../config/database");
const secret_config = require("../config/secret");

module.exports = () => {
    passport.use(new GoogleStrategy({
        clientID: secret_config.GOOGLE_CLIENT_ID,
        clientSecret: secret_config.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            const userEmail = profile._json.email
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
        }
    ));
};
