const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
// db
const connection = require("./database");
app.use("/", require("./api/Member"));

//db연결 확인

// 추가
app.use(express.json()); //json 형태로 parsing
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.listen(3000);
