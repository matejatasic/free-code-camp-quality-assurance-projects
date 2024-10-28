const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    commentcount: {
        type: Number,
        required: true,
        default: 0
    }
});

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    book_id: {
        type: String,
        required: true
    }
});

const Book = mongoose.model("Book", BookSchema);
const Comment = mongoose.model("Comment", CommentSchema);

module.exports = { Book, Comment }