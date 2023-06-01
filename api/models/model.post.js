const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        max: 500
    },
    username: {
        type: String,
        required: true
    },
}) 

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        max: 700
    },
    image: String,
    likes: {
        type: Array,
        default: []
    },
    comments: [CommentSchema],
}, {
    timestamps: true
})

module.exports = mongoose.model("Post", PostSchema);