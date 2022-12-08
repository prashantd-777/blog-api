const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    desc: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false,
        default: ""
    },
    username: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: false,
        default: 0
    },
    categories: {
        type: Array,
        required: false,
    }
}, { timestamps: true });


module.exports = mongoose.model("Post", PostSchema);