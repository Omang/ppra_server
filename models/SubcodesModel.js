const mongoose = require('mongoose');

const SubcodesSchema = new mongoose.Schema({
    subcode_name: {type:String},
    subcode_description:{type: String},
    subcode_requirement: {type: String},
    subcode_level:[{type: String}]
},{timestamps: true});


module.exports = mongoose.model('Subcodes', SubcodesSchema);