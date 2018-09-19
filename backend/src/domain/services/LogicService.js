import { stats } from '../content/entities/stats';
import { locations } from '../content/entities/locations';
import { roads } from '../content/entities/roads';
import { rounds } from '../content/entities/rounds';
import { events } from '../content/entities/events';
import { heroManager } from '../logic/HeroManager';
import { taskManager } from '../logic/TaskManager';

export class LogicService {
  constructor(model) {
    console.log('----- LogicService model -----' + JSON.stringify(model));
    if (!model) {
      this.model = {
        stats: stats,
        roads: roads,
        locations: locations,
        events: events,
        hero: heroManager.createHero()
      };
      return;
    }

    this.model = model;
  }

  run() {
    this.model = {
      stats: stats,
      roads: roads,
      locations: locations,
      events: events,
      hero: heroManager.createHero()
    };

    return { ...this.model };
  }

  allocatePoint(stat) {
    var pointsToStats = {};
    pointsToStats[stat] = 1;
    heroManager.allocatePoints(this.model.hero, pointsToStats);
    this._updateModel();
    return { ...this.model };
  }

  rest() {
    heroManager.nextEvent(this.model.hero);
    this._updateModel();
    return { ...this.model };
  }

  startOrders() {
    heroManager.startOrders(this.model.hero);
    this._updateModel();
    return { ...this.model };
  }

  addOrder(orderIndex) {
    heroManager.addOrder(this.model.hero, orderIndex);
    this._updateModel();
    return { ...this.model };
  }

  finishOrders() {
    heroManager.finishOrders(this.model.hero);
    this._updateModel();
    return { ...this.model };
  }

  startTrip(roadId) {
    heroManager.startTrip(this.model.hero, roadId);
    this._updateModel();
    return { ...this.model };
  }

  goHome() {
    heroManager.goHome(this.model.hero);
    this._updateModel();
    return { ...this.model };
  }

  makeChoice(choiceIndex) {
    heroManager.makeChoice(this.model.hero, choiceIndex);
    this._updateModel();
    return { ...this.model };
  }

  nextEvent() {
    heroManager.nextEvent(this.model.hero);
    this._updateModel();
    return { ...this.model };
  }

  _updateModel() {
    if (this.model.hero.stageId == 'map') {
      this.model.routes = this._getRoutes();
    }

    if (this.model.hero.stageId == 'orders') {
      console.log(
        'rounds[this.model.hero.round - 1].orders',
        JSON.stringify(rounds[this.model.hero.round - 1].orders)
      );
      this.model.orders = rounds[this.model.hero.round - 1].orders;
    }
  }

  _getRoutes() {
    var routes = [];

    if (!taskManager.hasWaitingTasks(this.model.hero.tasks)) {
      return routes;
    }

    for (var roadId in roads) {
      var road = roads[roadId];
      var route = this._getRoute(roadId, road);
      if (route) {
        routes.push(route);
      }
    }

    return routes;
  }

  _getRoute(roadId, road) {
    if (road.sourceId == this.model.hero.sourceId) {
      return {
        roadId: roadId,
        sourceId: road.sourceId,
        targetId: road.targetId,
        duration: road.duration
      };
    } else if (road.targetId == this.model.hero.targetId) {
      return {
        roadId: roadId,
        sourceId: road.targetId,
        targetId: road.sourceId,
        duration: road.duration
      };
    } else {
      return null;
    }
  }
}
