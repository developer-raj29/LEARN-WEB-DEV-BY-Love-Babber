const mongoose = require('mongoose');

const passwordResetTokenSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  token: { type: String, required: true },
  token_expiry: { type: Date, required: true }
});

module.exports = mongoose.model('PasswordResetToken', passwordResetTokenSchema);
