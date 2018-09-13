const mongoose = require('mongoose');

// Declare Schema
const PlayerSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    bestScore: { type: Number },
    // userid: String,
    // updated_at: { type: Date, default: Date.now },
    facebook_id: { type: String },
    twitter_id: { type: String },
    google_id: { type: String }
  },
  { timestamps: true }
);

// Declare Model to mongoose with Schema
PlayerSchema.statics.findOrCreate = require('find-or-create');

// Export Model to be used in Node
module.exports = mongoose.model('Player', PlayerSchema);
