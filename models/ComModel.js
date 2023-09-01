const mongoose = require('mongoose');

const ComSchema = new mongoose.Schema({
    message_type:{type:String},
    themessage: {type:String},
    message_read: {type: Boolean, default: false}
},{timestamps: true});


module.exports = mongoose.model('Comm', ComSchema);