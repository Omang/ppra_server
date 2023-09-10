const mongoose = require('mongoose');

const AppSchema = new mongoose.Schema({
        
        auth_id: {type: mongoose.Schema.Types.ObjectId, ref: "Auth"},
        application_type: {type: String},
        application_cost: {type: String},
        application_attachment:[{type:String}],
        application_paid: {type:Boolean, default:false},
        license_paid: {type:Boolean, default:false},
        application_approved: {type: Boolean, default: true},
        application_pending: {type: Boolean, default: true},
        application_approveby: {type: mongoose.Schema.Types.ObjectId, ref:'Auth'},
        application_comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comm'}]
     
}, {timestamps: true})

module.exports = mongoose.model('Application', AppSchema);