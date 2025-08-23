const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  isAdmin: { type: Boolean, required: true, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
