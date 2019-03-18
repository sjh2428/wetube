import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";
import { localsMiddleWare } from "./middlewares";

import "./passport";

const app = express();

const CookieStore = MongoStore(session);

app.use(helmet());
app.set("view engine", "pug");
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CookieStore({mongooseConnection: mongoose.connection})
}));
// express는 session을 이용함으로써, 쿠키를 다룰 수 있음. 그리고,
// passport를 통해서 session을 이용하는데, 즉 session이 가진 쿠키를 이용한다는 것을 의미
// 그리고 그 passport로 deserialize를 진행함
// session은 cookie를 해독.
// deserialize로 사용자를 식별하면 passport는 방금 찾은 그 사용자를 Middleware나
// routes의 request object에 할당
// 그래서 어느 route에서든 로그인한 사용자가 누구인지 체크 가능
app.use(passport.initialize());
app.use(passport.session());

app.use(localsMiddleWare);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

// const betweenHome = (req, res, next) => {
//     console.log("Between");
//     next();
// };

// app.use(betweenHome);

// const middleware = (req, res, next) => {
//    res.send("not happening");
// };  //Like this, middleware can cut the connection.
// app.get("/", betweenHome, handleHome);

export default app;