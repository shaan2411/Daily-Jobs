const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['seeker', 'employer'], required: true },
  addressProof: { type: String }, // Path to the uploaded document
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
