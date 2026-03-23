const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DEPARTMENTS = ['water', 'road', 'electrical', 'sanitation', 'administration'];

const AuthoritySchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  department:   { type: String, required: true, enum: DEPARTMENTS },
  role:         { type: String, enum: ['officer', 'supervisor', 'admin'], default: 'officer' },
  passwordHash: { type: String, required: true },
  isActive:     { type: Boolean, default: true },
  createdAt:    { type: Date, default: Date.now }
});

AuthoritySchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

AuthoritySchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('Authority', AuthoritySchema);
