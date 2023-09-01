const mongoose = require('mongoose');

const DirectorSchema = new mongoose.Schema({
   
        fullname: {type: String},
        nationality: {type: String},
        percent_own: {type:String},
        identity_attachment:{type: String},
        Postal_address: {type: String},
        physical_address: {type: String}
   
})

module.exports = mongoose.model('Director', DirectorSchema);