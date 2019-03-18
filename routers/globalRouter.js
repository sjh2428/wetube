import express from "express";
import passport from "passport";
import routes from "../routes";
import { home, search } from "../controller/videoController";
import { postJoin, getJoin, postLogin, getLogin, logout, githubLogin, postGithubLogin, getMe } from "../controller/userController";
import { onlyPublic, onlyPrivate } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.logout, onlyPrivate, logout);
globalRouter.get(routes.search, search);

globalRouter.get(routes.github, githubLogin);
// github login url로 들어오면 userController.js에 있는 gitgubLogin을 실행함.
// 그러면 passport.js에 있는 passport의 GithubStrategy를 이용하게 됨.
// 깃헙 페이지로 갔다가 돌아올 때 callbackURL로 돌아오면서 사용자 정보를 받게 됨.
// 그 후 callbackURL로 접근했다면 passport.authenticate()를 사용함.
// 즉, 여기서 userController.js에 있는 githubLoginCallback 함수를 실행하게 됨.
// 로그인 과정이 성공적이었고 githubLoginCallback 함수가 문제없이 결과를 리턴하면 
// 아래의 postGithubLogin을 실행
// postGithubLogin은 사용자를 home으로 보냄

globalRouter.get(
    routes.githubCallback, 
    passport.authenticate("github", { failureRedirect: "/login" }), 
    postGithubLogin
);

globalRouter.get(routes.me, getMe);

export default globalRouter;