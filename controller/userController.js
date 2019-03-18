import passport from "passport";
import routes from "../routes";
import User from "../models/User";

export const getJoin = (req, res) => {
    res.render("join", {pageTitle: "Join"});
};
export const postJoin = async(req, res, next) => {
    const {
        body: {name, email, password, password2}
    } = req;
    if(password !== password2) {
        res.status(400);
        res.render("join", {pageTitle: "Join"});
    } else {
        try {
            const user = await User({
                name, email
            });
            await User.register(user, password);
            next();
        } catch(error) {
            console.log(error);
            res.redirect(routes.home);
        }
    }
};
export const getLogin = (req, res) => {
    res.render("login", {pageTitle: "Login"});
};
export const postLogin = passport.authenticate("local", {
    failureRedirect: routes.login,
    successRedirect: routes.home
});

export const githubLogin = passport.authenticate("github");

export const githubLoginCallback = async(accessToken, refreshToken, profile, cb) => {
    // console.log(accessToken, refreshToken, profile, cb);
    const { _json: { id, avatar_url: avatarUrl, name, email } } = profile;
    if (email == null) {
        console.log("Set your github email to public!✅");
        return cb("error! Set your github email to public!✅");
    }
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.githubId = id;
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            githubId: id,
            avatarUrl
        });
        return cb(null, newUser);
        // newUser Object를 가지고 쿠키를 만들고 저장함.
        // 이 저장된 쿠키를 브라우저로 보냄
    } catch(error) {
        return cb(error);
    }
};

export const postGithubLogin = (req, res) => {
    res.redirect(routes.home);
}

export const logout = (req, res) => {
    req.logout();
    res.redirect(routes.home);
};
export const getMe = (req, res) => {
    res.render("userDetail", {pageTitle: "Users", user: req.user});
}
export const userDetail = async(req, res) => {
    const { params: { id } } = req;
    try {
        const user = await User.findById(id).populate("videos");
        res.render("userDetail", {pageTitle: "User Detail", user});
    } catch(error) {
        res.redirect(routes.home);
    }
};
export const getEditProfile = (req, res) => {
    res.render("editProfile", {pageTitle: "Edit Profile"});
};
export const postEditProfile = async(req, res) => {
    const {
        body: { name, email },
        file
    } = req;
    try {
        await User.findByIdAndUpdate(req.user.id, { 
            name, 
            email, 
            avatarUrl: file ? file.path : req.user.avatarUrl
        });
        res.redirect(routes.me);
    } catch(error) {
        res.redirect(routes.editProfile);
    }
};
export const getChangePassword = (req, res) => {
    res.render("changePassword", {pageTitle: "Change Password"});
};
export const postChangePassword = async(req, res) => {
    const {
        body: {
            oldPassword,
            newPassword,
            newPassword1
        }
    } = req;
    try {
        if (newPassword !== newPassword1) {
            res.status(400);
            res.redirect(`/users/${routes.changePassword}`);
            return;
        }
        await req.user.changePassword(oldPassword, newPassword);
        res.redirect(routes.me);
    } catch(error) {
        res.status(400);
        res.redirect(`/users/${routes.changePassword}`);
    }
};