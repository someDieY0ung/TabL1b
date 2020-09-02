// notation Schema Setup
const mongoose = require('mongoose');
const notationSchema = new mongoose.Schema({
    author: String,
    title: String,
    images: [String],
    uploader: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});


module.exports = mongoose.model('Notation', notationSchema);