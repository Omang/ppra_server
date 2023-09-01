const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    fullname: {type: String},
    email: {type: String},
    nationality: {type: String},
    Qualification: {type:String}
})

module.exports = mongoose.model('Employees', EmployeeSchema);