const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
   auth_id: {type: mongoose.Schema.Types.ObjectId, ref: "Auth"},
   firstname :{type: String},
   lastname: {type: String},
   gender: {type:String},
   mobilenumber: {type:String},
   DOB: {type:String},
   POB: {type:String},
   Nationality: {type:String}
}, {timestamps: true});


module.exports = mongoose.model('User', UserSchema);