const mongoose = require('mongoose');


const PaySchema = new mongoose.Schema({
    amount: {type:String},
    payment_status: {type:Boolean},
    payment_madeby: {type: mongoose.Schema.Types.ObjectId, ref: 'Auth'}
})

module.exports = mongoose.model('Payment', PaySchema);