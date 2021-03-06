import multer from "multer";
import routes from "./routes";

const multerVideo = multer({dest: "uploads/videos/"});
// videos라는 폴더의 이름 아래에 파일을 넣겠다 라는 의미라고 알면 될듯
const multerAvatar = multer({dest: "uploads/avatars/"});

export const localsMiddleWare = (req, res, next) => {
    res.locals.siteName = 'WeTube';
    res.locals.routes = routes;
    res.locals.loggedUser = req.user || null;
    next();
}

export const onlyPublic = (req, res, next) => {
    if (req.user) {
        res.redirect(routes.home);
    } else {
        next();
    }
}

export const onlyPrivate = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect(routes.home);
    }
}

export const uploadVideo = multerVideo.single('videoFile');
// single은 하나의 파일만 업로드 가능하다는 것을 의미
// form에서 넘어오는 파일의 name을 single의 인자에 넣어줘야함.
export const uploadAvatar = multerAvatar.single('avatar');