const mongoose = require('mongoose');


const CompanySchema = new mongoose.Schema({
   auth_id: {type: mongoose.Schema.Types.ObjectId, ref: "Auth"},
   company_name:{type:String},
   company_cipa: {type: String},
   company_directors: [{type: mongoose.Schema.Types.ObjectId, ref: "Director"}],
   company_assets: [{
      asset_name: {type: String},
      asset_value: {type: String},
      asset_certificate: {type: String}
   }],
   company_type:{type:String},
   company_ownership: {type:String},
   company_suspend:{
      suspended: {type: Boolean, default: false},
      when: {type:Date},
      by_who: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
   },
   company_bank:{
      account_name: {type: String},
      account_branch:{type: String},
      account_number: {type: String},
      bank_letter: {type: String}
   },
   company_contacts:{
      email:{type:String},
      phonenumber: {type:String}
   },
   company_address: {
      postal_address: {type:String},
      physical_address: {type:String}
   },
   company_location: {type:String},
   company_codes: [{type: mongoose.Schema.Types.ObjectId, ref: "Application"}],
   approved_codes: [{type: mongoose.Schema.Types.ObjectId, ref: "Subcodes"}],
   topayment_codes: [{type: mongoose.Schema.Types.ObjectId, ref: "Subcodes"}],
   application_fees:{type:Boolean, default: false},
   company_employees:[{type: mongoose.Schema.Types.ObjectId, ref: "Employees"}],
   company_projects:[{type: mongoose.Schema.Types.ObjectId, ref: "Projects"}],
   codes_payments: {type: mongoose.Schema.Types.ObjectId, ref: "Payment"},
   codes_express: {type: mongoose.Schema.Types.ObjectId, ref: "Payment"},
   payment_waiting: {type: Boolean, default: false}
}, {timestamps: true});

module.exports = mongoose.model('Company', CompanySchema);