const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    project: {
        type: String,
        required: true,
    },
    issue_title: {
        type: String,
        required: true
    },
    issue_text: {
        type: String,
        required: true
    },
    created_on: Date,
    updated_on: Date,
    created_by: {
        type: String,
        required: true
    },
    assigned_to: {
        type: String,
        required: false
    },
    open: {
        type: Boolean,
        required: true,
        default: true
    },
    status_text: {
        type: String,
        required: false
    }
});

const Issue = mongoose.model("Issue", IssueSchema);

module.exports = { Issue }
