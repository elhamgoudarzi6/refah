const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const AdminSchema = new Schema({
    username: { type: String, required: false },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    image: { type: String },
    token:{ type: String },
    type:{ type: String,default:'admin'},
});
AdminSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        next();
    });
})
module.exports = mongoose.model('Admin', AdminSchema);
