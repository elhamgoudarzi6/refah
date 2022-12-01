const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DeadlineSchema = new Schema({
    lock: { type: Boolean,default:false},
});
module.exports = mongoose.model('Deadline', DeadlineSchema);
