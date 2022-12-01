const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const EmployeeSchema = new Schema({
    mobile: { type: String },
    password: { type: String },
    personalCode: { type: String },
    nationalCode: { type: String},
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber:{ type: String},
    type:{ type: String,default:'user'},
    token: { type: String },
   loanPrevious:{ type:Boolean,default:false},
},{toJSON:{virtuals:true}});
EmployeeSchema.virtual('request',{
    ref:'Request',
    localField:'_id',
    foreignField:'employee_id',
});
EmployeeSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
})
module.exports = mongoose.model('Employee', EmployeeSchema);
