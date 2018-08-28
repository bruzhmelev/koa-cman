const mongoose = require('mongoose');

// Declare Schema
const PlayerSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    bestScore: { type: Number }
  },
  { timestamps: true }
);

// Declare Model to mongoose with Schema
const Player = mongoose.model('Player', PlayerSchema);

// Export Model to be used in Node
module.exports = mongoose.model('Player');
