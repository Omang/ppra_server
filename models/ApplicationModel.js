const mongoose = require('mongoose');

const AppSchema = new mongoose.Schema({
        
        auth_id: {type: mongoose.Schema.Types.ObjectId, ref: "Auth"},
        company_id: {type: mongoose.Schema.Types.ObjectId, ref: "Company"},
        subcode: {type: mongoose.Schema.Types.ObjectId, ref: "Subcodes"},
        attachment: [{type: String}],
        subcode_level: {type: String},
        subcode_pendingverification: {type: Boolean, default: true},
        subcode_pendingassesment: {type: Boolean, default: true},
        subcode_pendingevaluation: {type: Boolean, default: true},
        subcode_pendingadjudication: {type: Boolean, default: true},
        subcode_approve: {type: Boolean, default: false},
        verification_by: {type: mongoose.Schema.Types.ObjectId, ref:'Auth'},
        assesment_by: {type: mongoose.Schema.Types.ObjectId, ref: 'Auth'},
        evaluation_by: {type: mongoose.Schema.Types.ObjectId, ref: 'Auth'},
        adjudication_by:[{type: mongoose.Schema.Types.ObjectId, ref: 'Auth'}],
        assessment_docs:[{type: String}],
        verification_comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comm'}],
        assesment_comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comm'}],
        evaluation_comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comm'}]
     
}, {timestamps: true})

module.exports = mongoose.model('Application', AppSchema);