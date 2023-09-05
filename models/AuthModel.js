const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AuthSchema = new mongoose.Schema({
    password: {type:String},
    email: {type:String, unique: true, trim: true},
    firstname :{type: String},
    lastname: {type: String},
    gender: {type:String},
    mobilenumber: {type:String},
    DOB: {type:String},
    POB: {type:String},
    nationality: {type:String},
    role:{type:String , default: 'contractor'},
    refreshToken:{type:String},
    messages:[{type: mongoose.Schema.Types.ObjectId, ref: 'Comm'}]
}, {timestamps: true});
AuthSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
 });
 AuthSchema.methods.isPasswordMatched = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
 }

module.exports = mongoose.model('Auth', AuthSchema);