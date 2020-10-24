const kakao = require('./kakaoStrategy');
const google = require('./googleStrategy');
// const facebook = require('./facebookStrategy');

module.exports = () => {
    kakao();
    google();
    // facebook();
};
