import mongoose from "mongoose";
import passportlm from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    avatarUrl: String,
    facebookId: Number,
    githubId: Number,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
});

userSchema.plugin(passportlm, {usernameField: "email"});

const model = mongoose.model("User", userSchema);
console.log('✅ User Model is bringing.');
export default model;