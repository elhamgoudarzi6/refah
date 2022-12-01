const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RequestLeasingSchema = new Schema({
  employee_id:{type : Schema.Types.ObjectId,ref:'Employee'},
  personalCode: {type:String,required:true },
  date:{type:String},
  result:{ type: Boolean,default:false }
});
module.exports = mongoose.model('Request_Leasing', RequestLeasingSchema);
