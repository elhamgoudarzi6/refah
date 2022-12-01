const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const random = require('mongoose-simple-random');

const RequestSchema = new Schema({
    employee_id:{type : Schema.Types.ObjectId,ref:'Employee'},
    personalCode: {type:String,required:true },
    date:{type:String},
    branch:{type:String},
    loanID:{type : Schema.Types.ObjectId},
    result:{ type: Boolean,default:false }
});
RequestSchema.plugin(random);
module.exports = mongoose.model('Request', RequestSchema);
