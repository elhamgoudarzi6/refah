const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const LoanSchema = new Schema({
    title: { type: String, required: false },
    amount: { type: String, required: true },
    number: { type: String,required:true }, // تعداد اقساط
    ceilingNum: {type: Number,required:true}, //سقف
    condition: { type: String },
    percent: { type: String },

});

module.exports = mongoose.model('Loan', LoanSchema);
