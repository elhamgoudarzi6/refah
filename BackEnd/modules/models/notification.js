const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NotificationSchema = new Schema({
    text: { type: String},
});
module.exports = mongoose.model('Notification', NotificationSchema);
