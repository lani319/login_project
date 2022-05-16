const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");

const jwt = require("jsonwebtoken");

const jwtKey = "jwt123456789";
const refreshKey = "ref123456789";
const accessExpired = "15m";

const members = [
  {
    id: 4,
    name: "홍길동",
    loginId: "a",
    loginPw: "a",
  },
];

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/api/mypage", loginCheck, (req, res) => {
  const token = req.cookies.token;

  if (token) {
    //access 토큰이 있으면
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (!err) {
        res.send(decoded); //jwt token 해석 결과를 리턴한다.
      } else {
        //토큰 만료 등이 발생하면 에러 표시를 출력한다.
        res.sendStatus(401);
      }
    });
  } else {
    res.sendStatus(400);
  }
});

function loginCheck(req, res, next) {
  console.log("헤더 : ", req.headers.authorization);
  if (req.cookies.token) {
    next();
  } else {
    res.send("로그인 유효 시간이 다 되었습니다. 다시 로그인 해 주세요.");
  }
}

//라우터에서 로그인 했는지 체크하는 것
app.get("/api/islogin", loginCheck, (req, res) => {
  const token = req.cookies.token;

  if (token) {
    //access 토큰이 있으면
    jwt.verify(token, jwtKey, (err, decoded) => {
      if (!err) {
        //res.send(decoded); //jwt token 해석 결과를 리턴한다.
        //res.sendStatus(200);
        res.send(true);
      } else {
        //토큰 만료 등이 발생하면 에러 표시를 출력한다.
        res.sendStatus(401);
      }
    });
  } else {
    res.sendStatus(400);
  }
});

app.post("/api/account", (req, res) => {
  const loginId = req.body.loginId;
  const loginPw = req.body.loginPw;

  const member = members.find(
    (m) => m.loginId === loginId && m.loginPw === loginPw
  );

  if (member) {
    const options = {
      domain: "localhost",
      path: "/",
      httpOnly: true,
    };
    const jwtToken = jwt.sign(
      {
        id: member.id,
        name: member.name,
      },
      jwtKey,
      { expiresIn: accessExpired, issuer: "lani" }
    );
    res.cookie("token", jwtToken, options); //cookie에 유저 정보 저장

    const refToken = jwt.sign(
      {
        id: member.id,
        name: member.name,
      },
      refreshKey,
      { expiresIn: "3d", issuer: "lani" }
    );

    res.cookie("refreshToken", refToken, options); //cookie에 유저 정보 저장

    const result = {
      member: member,
      access_token: jwtToken,
      refresh_token: refToken,
    };
    res.send(result);
  }
});

app.delete("/api/account", (req, res) => {
  if (req.cookies && req.cookies.token) {
    res.clearCookie("token");
    res.sendStatus(200);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
