import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async(req, res) => {
    try {
        const videos = await Video.find({}).sort({ _id: -1 });
        res.render("home", {pageTitle: "Home", videos});
    } catch(error) {
        console.log(error);
        res.render("home", {pageTitle: "Home", videos: []});
    }
}
export const search = async(req, res) => {
    const searchingBy = req.query.term;
    // const {query: {term: searchingBy}} = req;
    let videos = [];
    try {
        // 'i' means insensitive. 대소문자를 구분하지 않음
        videos = await Video.find({ title: { $regex: searchingBy, $options: "i"} });
    } catch(error) {
        console.log(error);
    }
    res.render("search", {pageTitle: "Search", searchingBy, videos});
}
export const getUpload = (req, res) => {
    res.render("upload", {pageTitle: "Upload"});
}
export const postUpload = async(req, res) => {
    const {
        body: {  title, description }, 
        file: { path }
    } = req;
    const newVideo = await Video.create({
        fileUrl: path,
        title,
        description,
        creator: req.user.id
    });
    // To Do: Upload and save video
    req.user.videos.push(newVideo.id);
    req.user.save();
    res.redirect(routes.videoDetail(newVideo.id));
}
export const videoDetail = async(req, res) => {
    const {
        params: {id}
    } = req;
    try {
        const video = await Video.findById(id).populate('creator').populate("comments");
        // populate를 붙이면 id가 나오는 것이 아니라 creator의 전체 Object가 나옴
        // console.log(video.comments[0].creator, typeof(video.comments[0].creator));
        // console.log(req.user._id, typeof(req.user._id));
        // console.log(video.comments[0].creator.toString() === req.user._id.toString());
        res.render("videoDetail", {pageTitle: video.title, video, user: req.user});
    } catch(error) {
        res.redirect(routes.home);
    }
}
export const getEditVideo = async(req, res) => {
    const {
        params: {id}
    } = req;
    try {
        const video = await Video.findById(id);
        if (String(video.creator) !== req.user.id) {
            throw Error();
        } else {
            res.render("editVideo", {pageTitle: `Edit ${video.title}`, video});
        }
    } catch(error) {
        res.redirect(routes.home);
    }
}
export const postEditVideo = async(req, res) => {
    const {
        params: {id},
        body: {title, description}
    } = req;
    try {
        await Video.findOneAndUpdate({ _id: id }, {title, description});
        res.redirect(routes.videoDetail(id));
    } catch(error) {
        res.redirect(routes.home);
    }
}
export const deleteVideo = async(req, res) => {
    const {
        params: {id}
    } = req;
    try {
        const video = await Video.findById(id);
        if (video.creator !== req.user.id) {
            throw Error();
        } else {
            await Video.findOneAndRemove({_id: id});
        }
    } catch(error) {
        console.log(error);
    }
    res.redirect(routes.home);
}

// Register Video View
export const postRegisterView = async(req, res) => {
    const { 
        params: {id}
    } = req;
    try {
        const video = await Video.findById(id);
        video.views += 1;
        video.save();
        res.status(200);
    } catch(error) {
        res.status(400);
    } finally {
        res.end();
    }
};

// Add Comment
export const postAddComment = async(req, res) => {
    const {
        params: {id},
        body: {comment},
        user
    } = req;
    try {
        const video = await Video.findById(id);
        const newComment = await Comment.create({
            text: comment,
            creator: user.id
        });
        video.comments.push(newComment.id);
        video.save();
        res.status(200).json({
            data: newComment._id
        });
    } catch(error) {
        res.status(400);
    } finally {
        res.end();
    }
}

// Del Comment
export const postDelComment = async(req, res) => {
    const {
        body: {cid},
        user
    } = req;
    try {
        const comId = await Comment.findById(cid);
        if (String(user.id) === String(comId.creator)) {
            comId.remove();
            res.status(200);
        } else {
            throw new Error("Wrong access! Not equal creator and user");
        }
    } catch(error) {
        console.log(error);
        res.status(400);
    } finally {
        res.end();
    }
}