// const LogicService = require('../domain/services/LogicService');
import { LogicService } from '../domain/services/LogicService';

async function allocatePoint(ctx) {
  let stat = ctx.request.body.stat;
  let model = ctx.request.body.model;
  let service = new LogicService(model);
  // TODO: REFACTORING. Каждый раз гонять модель целиком по сети при том в таком виде как она есть сейчас это жесть.
  let model = service.allocatePoint(stat);
  ctx.body = { model };
}

async function rest(ctx) {
  let model = ctx.request.body.model;
  let service = new LogicService(model);
  let model = service.rest();
  ctx.body = { model };
}

async function startOrders(ctx) {
  let model = ctx.request.body.model;
  let service = new LogicService(model);
  let model = service.startOrders();
  ctx.body = { model };
}

async function addOrder(ctx) {
  let orderIndex = ctx.request.body.orderIndex;
  let model = ctx.request.body.model;
  let service = new LogicService(model);
  let model = service.addOrder(orderIndex);
  ctx.body = { model };
}

async function finishOrders(ctx) {
  let model = ctx.request.body.model;
  let service = new LogicService(model);
  let model = service.finishOrders();
  ctx.body = { model };
}

async function startTrip(ctx) {
  let roadId = ctx.request.body.roadId;
  let model = ctx.request.body.model;
  let service = new LogicService(model);
  let model = service.startTrip(roadId);
  ctx.body = { model };
}

async function goHome(ctx) {
  let model = ctx.request.body.model;
  let service = new LogicService(model);
  let model = service.goHome();
  ctx.body = { model };
}

async function makeChoice(ctx) {
  let choiceIndex = ctx.request.body.choiceIndex;
  let model = ctx.request.body.model;
  let service = new LogicService(model);
  let model = service.makeChoice(choiceIndex);
  ctx.body = { model };
}

async function nextEvent(ctx) {
  let model = ctx.request.body.model;
  let service = new LogicService(model);
  let model = service.nextEvent();
  ctx.body = { model };
}

module.exports = {
  allocatePoint,
  rest,
  startOrders,
  addOrder,
  finishOrders,
  startTrip,
  goHome,
  makeChoice,
  nextEvent
};
