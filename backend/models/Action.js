const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actionType: String,
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Action', actionSchema);
