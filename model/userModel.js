const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = Schema({
   username: { type: String, required : true, unique: true },
   email: { type: String, required : true, unique: true},
   password: { type: String, required : true },
   notes: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
   otp: {type: String},
   otpExpires: {type: Date},
},
 {
  timestamps: true,
  versionKey: false,
 }
);
const User = mongoose.model('User', userSchema);

module.exports = User;