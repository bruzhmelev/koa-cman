const Player = require('../models/player');

async function findAll(ctx) {
  // Fetch all Player’s from the database and return as payload
  const players = await Player.find({});
  ctx.body = players;
}

async function create(ctx) {
  // Create New Todo from payload sent and save to database
  const newPlayer = new Player(ctx.request.body);
  const savedPlayer = await newPlayer.save();
  ctx.body = savedPlayer;
}

async function destroy(ctx) {
  // Get id from url parameters and find Player in database
  const id = ctx.params.id;
  const player = await Player.findById(id);

  // Delete todo from database and return deleted object as reference
  const deletedPlayer = await player.remove();
  ctx.body = deletedPlayer;
}

async function update(ctx) {
  // Find Player based on id, then toggle done on/off
  const id = ctx.params.id;
  const player = await Player.findById(id);
  player.done = !player.done;

  // Update todo in database
  const updatedPlayer = await player.save();
  ctx.body = updatedPlayer;
}

module.exports = {
  findAll,
  create,
  destroy,
  update
};
