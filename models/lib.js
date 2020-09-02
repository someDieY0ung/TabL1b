// lib Schema Setup
const mongoose = require('mongoose');
const libSchema = new mongoose.Schema({
    name: String,
    image: String,
    author: {
         id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
         },
         username: String
           
    },
    notations: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Notation"
        }
     ]
});


module.exports = mongoose.model('Lib', libSchema);