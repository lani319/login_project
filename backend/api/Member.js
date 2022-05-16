const express = require("express");
const app = express.Router();
const jwt = require("jsonwebtoken");
const jwtKey = "fksl71324278";
const refreshKey = "fksl71327132";
const accessExpired = "1d";

//node crypto
const crypto = require("crypto");

//dbCon
const connection = require("../database");

//password 암호화 위한 값
var CryptoJS = require("crypto-js");
const cookieParser = require("cookie-parser");
var key = "a@$F15HHd&&dedx";

// 추가
app.use(express.json()); //json 형태로 parsing
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//암호화 시작
function encrypt(text) {
  return CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
}

function decrypt(text) {
  var result = CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return result.toString(CryptoJS.enc.Utf8);
}
//암호화 끝

function base64(json) {
  // JSON을 문자열화
  const stringified = JSON.stringify(json);
  // 문자열화 된 JSON 을 Base64 로 인코딩
  const base64Encoded = Buffer.from(stringified).toString("base64");
  // Base 64 의 Padding(= or ==) 을 제거
  const paddingRemoved = base64Encoded.replaceAll("=", "");
  return paddingRemoved;
}

//디코드 토큰
function decodeToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded);
    });
  });
}

//회원가입
// id userId userName userPassword
app.post("/api/member/regist/", (req, res) => {
  try {
    const query1 = `select id from Member 
    where userId='${req.body.userId}';`;

    console.log(query1);

    connection.query(query1, (error, rows, field) => {
      console.log("rows : ", rows, rows.length);

      if (rows.length > 0) {
        res.status(400).send({ success: false, message: "중복 아이디" });
      } else {
        const encPwd = encrypt(req.body.userPassword);
        const query2 = `insert into Member(userId,userName,userPassword,loginType) 
        values('${req.body.userId}','${req.body.userName}','${encPwd}','id');`;

        connection.query(query2, (error, result) => {
          if (!error) {
            console.log("result", result);
            res.status(200).send({ success: true, message: "가입 성공" });
          } else {
            res.status(500).send({ success: false, message: "가입 실패" });
          }
        });
      }
    });
  } catch (e) {
    console.log("error : ", e);
  }
});

//로그인
app.post("/api/member/login/", async (req, res) => {
  const encPwd = encrypt(req.body.userPassword);
  const query = `select id,userId,userName,loginType from Member 
  where userId='${req.body.userId}' and userPassword='${encPwd}';`;

  //console.log(query);

  try {
    await connection.query(query, (error, rows) => {
      //console.log(rows, rows[0]);

      if (!error && rows[0]) {
        const rowData = JSON.parse(JSON.stringify(rows[0]));
        console.log(rowData);
        if (rowData.userId) {
          const options = {
            domain: "localhost",
            path: "/",
            httpOnly: true,
          };
          const jwtToken = jwt.sign(
            {
              id: rowData.id,
              userId: rowData.userId,
              userName: rowData.userName,
            },
            jwtKey,
            { expiresIn: accessExpired, issuer: "lani" }
          );
          res.cookie("token", jwtToken, options); //cookie에 유저 정보 저장

          const refToken = jwt.sign(
            {
              id: rowData.id,
              userId: rowData.userId,
              userName: rowData.userName,
            },
            refreshKey,
            { expiresIn: "3d", issuer: "lani" }
          );

          res.cookie("refreshToken", refToken, options); //cookie에 유저 정보 저장

          res.status(200).send(rows); //리턴 값으로 회원 정보 넘기기
        }
      } else {
        res
          .status(404)
          .send({ success: false, message: "아이디 또는 비밀번호가 다릅니다" });
      }
    });
  } catch (e) {
    res.status(500).send({ message: "unknown error" });
  }
});

//로그아웃
app.delete("/api/member/logout/", (req, res) => {
  res.clearCookie("jwt");
  res.sendStatus(200);
});

function loginCheck(req, res, next) {
  if (req.cookies.token) {
    next();
  } else {
    res.send("로그인 유효 시간이 다 되었습니다. 다시 로그인 해 주세요.");
  }
}

//mypage
app.get("/api/member/mypage/", loginCheck, async (req, res) => {
  if (req.cookies && req.cookies.token) {
    //console.log(req.cookies.jwt);
    const jwtToken = req.cookies.token;

    jwt.verify(jwtToken, jwtKey, (err, decoded) => {
      //console.log("decoded=>", decoded);

      if (!err) {
        const query = `select userId,userName,loginType from Member where userId='${decoded.userId}';`;

        console.log(query);

        connection.query(query, (error, result) => {
          res.status(200).send(result); //리턴 값으로 회원 정보 넘기기
          //return res.sendStatus(200).json({ data: JSON.stringify(result) });
        });

        //res.send(decoded);
      } else {
        //console.log(err);
        //res.sendStatus(401).send({ message: err });
        res.sendStatus(401);
      }
    });
  } else {
    //res.sendStatus(401);
    return res.sendStatus(400);
  }
});

module.exports = app;
