const { pool } = require('../../../config/database');
const { logger } = require('../../../config/winston');
const jwt = require('jsonwebtoken');
const secret_config = require('../../../config/secret');

exports.homeRoomInterest = async function (req, res) {
    try {
        const userIdx = req.params.userIdx //패스배리어블 데이터 받기
        const decode = await jwt.verify(req.headers['x-access-token'], secret_config.jwtsecret) // jwt토큰 받기
        const jwtUserIdx = decode.userIdx // jwt토큰에서 data 받기

        if (userIdx != jwtUserIdx) {
            return res.json({
                isSuccess: false,
                code: 202,
                message: "권한이 없습니다.",
            })
        }

        const connection = await pool.getConnection(async conn => conn); // DB연결

        try {
            const getHomeRoomInterest = `
                select U.searchLog as regionName,
COALESCE(concat(RN.roomNum,'개의 방'),'0개의 방') as roomNum,
COALESCE(R.regionImg,'https://firebasestorage.googleapis.com/v0/b/allroom.appspot.com/o/default%2F%EB%B0%A9%20%EA%B8%B0%EB%B3%B8%EC%9D%B4%EB%AF%B8%EC%A7%80.PNG') as regionImg,
replace(replace(U.roomType,'투쓰리룸','투ㆍ쓰리룸'),'|',',') as roomType
from (select U.searchLog, U.createdAt, R.roomType from
(select searchLog, Max(createdAt) as createdAt
from UserSearchLog
where userIdx = ?
group by searchLog) as U
left join UserSearchLog as R
on R.searchLog = U.searchLog and R.createdAt = U.createdAt) as U
left join (select dongAddress as region, dongImg as regionImg from Region
union
select stationName as region, stationImg as regionImg from Station
union
select universityName as region, universityImg as regionImg from University) as R
on R.region = U.searchLog
left join (select roomAddress as region,
count(roomAddress) as roomNum
from Room
group by roomAddress
union
select S.stationName as region ,count(S.stationName) as roomNum from Station as S, Room as R
where (select Round(6371 * acos(cos(radians((S.latitude))) *
cos(radians(R.latitude)) * cos(radians(R.longitude) - radians(
(S.longitude))) +
sin(radians((S.latitude))) *
sin(radians(R.latitude))), 0)) <=1
group by S.stationName
union
select S.universityName as region ,count(S.universityName) as roomNum from University as S, Room as R
where (select Round(6371 * acos(cos(radians((S.latitude))) *
cos(radians(R.latitude)) * cos(radians(R.longitude) - radians(
(S.longitude))) +
sin(radians((S.latitude))) *
sin(radians(R.latitude))), 0)) <=1
group by S.universityName) as RN
on R.region = RN.region
where U.searchLog Like '%동' or U.searchLog Like '%면' or  U.searchLog Like '%읍' or  U.searchLog Like '%역' or U.searchLog Like '%교'
order by U.createdAt desc
limit 5
`;
            const userIdxParams = [userIdx];
            const [rows] = await connection.query(
                getHomeRoomInterest,
                userIdxParams
            )


            connection.release();
            return res.json({
                result: rows,
                isSuccess: true,
                code: 100,
                message: "관심지역 모든 방 리스트."
            });
        } catch (err) {
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }

    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }

};

exports.homeComplexInterest = async function (req, res) {
    try {
        const userIdx = req.params.userIdx //패스배리어블 데이터 받기
        const decode = await jwt.verify(req.headers['x-access-token'], secret_config.jwtsecret) // jwt토큰 받기
        const jwtUserIdx = decode.userIdx // jwt토큰에서 data 받기

        if (userIdx != jwtUserIdx) {
            return res.json({
                isSuccess: false,
                code: 202,
                message: "권한이 없습니다.",
            })
        }

        const connection = await pool.getConnection(async conn => conn); // DB연결

        try {
            const getHomeComplexInterest = `
            select URL.complexIdx,
            COALESCE(C.complexName, "null")     as complexName,
            COALESCE(CI.complexImg, "https://firebasestorage.googleapis.com/v0/b/allroom.appspot.com/o/default%2F%EB%B0%A9%20%EA%B8%B0%EB%B3%B8%EC%9D%B4%EB%AF%B8%EC%A7%80.PNGalt=media&token=ac7a7438-5dde-4666-bccd-6ab0c07d0f36\") as complexImg,
            COALESCE(concat(RN.roomNum,'개의 방'), "0개의 방")     as roomNum,
            COALESCE(C.kindOfBuilding, "null")     as kindOfBuilding,
            COALESCE(concat(C.householdNum,'세대'), "null")     as householdNum,
            COALESCE(C.completionDate, "null")     as completionDate
     from (select Max(userComplexLogIdx) as userComplexLogIdx, complexIdx from UserComplexLog
     where userIdx= ? and isDeleted="N"
     group by complexIdx) as URL
     left join UserComplexLog as URL2
     on URL2.userComplexLogIdx = URL.userComplexLogIdx and URL2.complexIdx = URL.complexIdx
     left join Complex as C
     on C.complexIdx = URL.complexIdx
     left join (select COM.complexName,
                                COM.kindOfBuilding,
                                COM.householdNum,
                                COM.completionDate,
                                CI.complexIdx,
                                CI.complexImg as complexImg
                         from (select complexIdx, Max(createdAt) as createdAt
                               from ComplexImg
                               group by complexIdx) as C
                                  left join ComplexImg as CI
                                            on CI.complexIdx = CI.complexIdx and C.createdAt = CI.createdAt
                                  left join Complex as COM
                                            on COM.complexIdx = CI.complexIdx
     ) as CI
                        on CI.complexIdx = C.complexIdx
              left join (select complexIdx, count(complexIdx) as roomNum
                         from RoomInComplex
                         group by complexIdx) as RN
                        on RN.complexIdx = C.complexIdx
     order by URL2.createdAt desc
     limit 5
`;
            const userIdxParams = [userIdx];
            const [rows] = await connection.query(
                getHomeComplexInterest,
                userIdxParams
            )

            connection.release();
            return res.json({
                result: rows,
                isSuccess: true,
                code: 100,
                message: "관심지역 모든 단지 리스트"
            });
        } catch (err) {
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return res.json({
                isSuccess: false,
                code: 314,
                message: '카페목록 조회 실패',
            });
        }

    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return res.json({
            isSuccess: false,
            code: 314,
            message: '카페목록 조회 실패',
        });
    }

};