const mongoose = require("mongoose");

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
    }
    
}, {
    timestamps: true
})

module.exports = mongoose.model("Post", PostSchema);