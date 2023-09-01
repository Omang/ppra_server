const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    project_name: {type: String},
    project_description: {type: String},
    project_for: {type: String},
    project_reference: {type:String}
})

module.exports = mongoose.model('Project', ProjectSchema);