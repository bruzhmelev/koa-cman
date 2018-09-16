// const LogicService = require('../domain/services/LogicService');
import { LogicService } from '../domain/services/LogicService';

module.exports = {
  run,
  allocatePoint,
  findAll,
  create,
  destroy,
  update
};

async function run(ctx) {
  let service = new LogicService();
  let model = service.run();
  ctx.body = { model };
}

async function allocatePoint(ctx) {
  let stat = ctx.request.body.stat;
  console.log('--- STAT ---: ' + JSON.stringify(stat));
  let service = new LogicService();
  // HACK:   let model = service.run();
  // TODO: После каждого действия нужно куда-то ходить сохранять состояние model
  // TODO: REFACTORING. Каждый раз гонять модель целиком по сети при том в таком виде как она есть сейчас это жесть.
  let model = service.run();
  let model = service.allocatePoint(stat);
  ctx.body = { model };
}

async function findAll(ctx) {
  // Fetch all Player’s from the database and return as payload
  const players = await Player.find({});
  ctx.body = players;
}

async function create(ctx) {
  // Create New player from payload sent and save to database
  const newPlayer = new Player(ctx.request.body);
  const savedPlayer = await newPlayer.save();
  ctx.body = savedPlayer;
}

async function destroy(ctx) {
  // Get id from url parameters and find Player in database
  const id = ctx.params.id;
  const player = await Player.findById(id);

  // Delete player from database and return deleted object as reference
  const deletedPlayer = await player.remove();
  ctx.body = deletedPlayer;
}

async function update(ctx) {
  // Find Player based on id
  const id = ctx.params.id;
  const player = await Player.findById(id);
  const newPlayer = ctx.request.body;

  console.log(JSON.stringify(newPlayer));

  player.name = newPlayer.name || player.name;
  player.email = newPlayer.email || player.email;
  player.bestScore = newPlayer.bestScore || player.bestScore;

  // Update player in database
  const updatedPlayer = await player.save();
  ctx.body = updatedPlayer;
}
