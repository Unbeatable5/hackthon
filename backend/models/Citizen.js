const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CitizenSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, unique: true, sparse: true, lowercase: true },
  phone:        { type: String, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  isVerified:   { type: Boolean, default: false },
  otp:          { type: String },
  otpExpiry:    { type: Date },
  createdAt:    { type: Date, default: Date.now }
});

CitizenSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

CitizenSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('Citizen', CitizenSchema);
