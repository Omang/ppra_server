const mongoose = require('mongoose');

const CodesSchema = new mongoose.Schema({
   cat_id: {type: mongoose.Schema.Types.ObjectId, ref:"Cat"},
   code_name: {type: String},
   subcodes: [{type: mongoose.Schema.Types.ObjectId, ref: "Subcodes"}],
   
}, {timestamps: true});

module.exports = mongoose.model('Codes', CodesSchema);