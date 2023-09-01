const mongoose = require('mongoose');

const CatSchema = new mongoose.Schema({
    cat_name: {type: String}
})

module.exports = mongoose.model('Cat', CatSchema);