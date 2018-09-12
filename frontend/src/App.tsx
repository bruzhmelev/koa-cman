import * as React from 'react';
import './App.css';
import { connect } from 'react-redux';
import { createPlayer, deletePlayer, fetchAllPlayers, updatePlayer } from 'actions/player';

import { RController } from './ui/RController';
import { stages } from './content/entities/stages';
import { PlayerForm } from 'components/PlayerForm/PlayerForm';

class App extends React.Component {
    state = {};

    private reactController: RController;
    private model: any;

    public componentWillMount() {
        this.reactController = new RController();
        this.model = this.reactController.run();
    }

    private allocatePointHandler = (statName: string) => () => {
        this.reactController.allocatePoint(statName);
        this.setState({});
    };

    private restHandler = () => () => {
        this.reactController.rest();
        this.setState({});
    };

    private startOrderHandler = () => () => {
        this.reactController.startOrders();
        this.setState({});
    };

    private finishOrderHandler = () => () => {
        this.reactController.finishOrders();
        this.setState({});
    };

    private addOrderHandler = (orderIndex: number) => () => {
        this.reactController.addOrder(orderIndex);
        this.setState({});
    };

    private goHomeHandler = () => () => {
        this.reactController.goHome();
        this.setState({});
    };

    private startTripHandler = (roadId: string) => () => {
        this.reactController.startTrip(roadId);
        this.setState({});
    };

    private makeChoiceHandler = (choiceIndex: number) => () => {
        this.reactController.makeChoice(choiceIndex);
        this.setState({});
    };

    private nextEventHandler = () => () => {
        this.reactController.nextEvent();
        this.setState({});
    };

    private renderMap = (roads: any, locations: any) => {
        return (
            <div className="panel2">
                <table>
                    {roads &&
                        Object.keys(roads).map((roadName: any) => {
                            let road = roads[roadName];
                            return (
                                <tr>
                                    <td>{locations[road.sourceId].title}</td>
                                    <td>{locations[road.targetId].title}</td>
                                    <td className="rigth">{road.duration} мин.</td>
                                </tr>
                            );
                        })}
                </table>
            </div>
        );
    };

    private renderEvent = (events: any, hero: any, stageName: string) => {
        var event = events[hero.eventIndex];
        if (!event) {
            return null;
        }

        return (
            <div id="event" className={hero.eventIndex == null ? 'hidden' : 'visible'}>
                <div className="title">{stageName}</div>
                <div>{event.text}</div>
                {event.choices.map((choice: any, choiceIndex: number) => {
                    return (
                        <div
                            className={hero.choiceIndex == choiceIndex ? 'button selected' : 'button'}
                            onClick={this.makeChoiceHandler(choiceIndex)}
                        >
                            {choice.text}
                        </div>
                    );
                })}
                <hr />
            </div>
        );
    };

    private renderOutcome = (events: any, hero: any) => {
        var event = events[hero.eventIndex];
        if (!event) {
            return null;
        }
        var choice = event.choices[hero.choiceIndex];
        var outcome = choice && choice.outcomes[hero.outcomeIndex];

        return (
            <div id="outcome" className={hero.outcomeIndex == null ? 'hidden' : 'visible'}>
                <div>{outcome && outcome.text}</div>
                <div className="button" onClick={this.nextEventHandler()}>
                    Дальше
                </div>
            </div>
        );
    };

    private renderStatsHeader = (hero: any, locations: any, stats: any) => {
        return (
            <div>
                Время: <span className={hero.late ? 'attention' : ''}>{hero.time}</span> | Деньги: {hero.score} |
                {Object.keys(hero.stats).map(statName => (
                    <span>
                        {stats[statName].title}: {hero.stats[statName]} &nbsp;
                    </span>
                ))}
                Раунд: {hero.round} | Поездка: {hero.trip}
                {locations[hero.targetId] ? <span>| Цель: {locations[hero.targetId].title}</span> : null}
            </div>
        );
    };

    private renderMyCurrentOrders = (hero: any, locations: any) => {
        return (
            <div id="tasks">
                <div className="title">Мои заказы</div>
                <table className={hero.tasks.length ? 'visible' : 'hidden'}>
                    {hero.tasks.map((task: any) => {
                        return (
                            <tr>
                                <td>{locations[task.targetId].title}</td>
                                <td className="rigth">{task.price} руб.</td>
                                <td>{task.status}</td>
                            </tr>
                        );
                    })}
                </table>
            </div>
        );
    };

    private renderInitStage = (hero: any, locations: any, stats: any, stageName: string) => {
        return (
            <div id="init" className={hero.stageId == 'init' ? 'visible' : 'hidden'}>
                <div className="title">{stageName}</div>
                <div>
                    Распрелите очки между характеристиками. Осталось: <span>{hero.points}</span>
                </div>
                <table>
                    {Object.keys(hero.stats).map(statName => {
                        const statValue = hero.stats[statName];
                        return (
                            <tr key={statName}>
                                <td>{stats[statName].title}</td>
                                <td className="rigth">{statValue}</td>
                                <td>
                                    <span className="button" onClick={this.allocatePointHandler(statName)}>
                                        +
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </table>
            </div>
        );
    };

    private renderHome = (hero: any, locations: any, stats: any, stageName: string) => {
        return (
            <div id="home" className={hero.stageId == 'home' ? 'visible' : 'hidden'}>
                <div className="title">{stageName}</div>
                <div className={hero.points ? 'button visible' : 'button hidden'} onClick={this.restHandler()}>
                    Отдохнуть
                </div>
                <div className="button" onClick={this.startOrderHandler()}>
                    Взять заказы
                </div>
            </div>
        );
    };

    private renderOrderSelector = (hero: any, locations: any, stageName: string, orders: any, roads: any, childrenMapRender: Function) => {
        return (
            <div id="orders" className={hero.stageId == 'orders' ? 'visible' : 'hidden'}>
                <div className="panel1">
                    <div className="title">{stageName}</div>
                    <table className={orders ? 'visible' : 'hidden'}>
                        {orders
                            ? orders.map((order: any, orderIndex: number) => {
                                  return (
                                      <tr key={orderIndex}>
                                          <td>{order.text}</td>
                                          <td>{locations[order.targetId].title}</td>
                                          <td className="rigth">{order.price} руб.</td>
                                          <td>
                                              <span className="button" onClick={this.addOrderHandler(orderIndex)}>
                                                  Выбрать
                                              </span>
                                          </td>
                                      </tr>
                                  );
                              })
                            : null}
                    </table>
                    <div className="button" onClick={this.finishOrderHandler()}>
                        Готово
                    </div>
                </div>
                {childrenMapRender(roads, locations)}
            </div>
        );
    };

    private renderRoadMap = (hero: any, locations: any, stageName: string, roads: any, routes: any, childrenMapRender: Function) => {
        return (
            <div id="map" className={hero.stageId == 'map' ? 'visible' : 'hidden'}>
                <div className="panel1">
                    <div className="title">{stageName}</div>
                    <div className="button" onClick={this.goHomeHandler()}>
                        Домой
                    </div>
                    <table className={routes && routes.length ? 'visible' : 'hidden'}>
                        {routes &&
                            routes.map((route: any, routeIndex: number) => {
                                return (
                                    <tr key={route.roadId}>
                                        <td>{locations[route.sourceId].title}</td>
                                        <td>{locations[route.targetId].title}</td>
                                        <td className="rigth">{route.duration} мин.</td>
                                        <td>
                                            <span
                                                className="button"
                                                onClick={this.startTripHandler(route.roadId)}
                                                data-on-click="startTrip(route.roadId)"
                                            >
                                                Выбрать
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                    </table>
                </div>
                {childrenMapRender(roads, locations)}
            </div>
        );
    };

    public render() {
        console.log('App', 'render');
        this.model = this.reactController.model;
        let { stats, roads, locations, events, hero, orders, routes } = this.model;
        console.log(JSON.stringify({ orders, hero }));
        const stageName = stages[hero.stageId] && stages[hero.stageId].title;

        return (
            <div className="host2 wide2">
                <PlayerForm />
                {this.renderStatsHeader(hero, locations, stats)}
                <hr />
                {this.renderMyCurrentOrders(hero, locations)}
                <hr />
                {this.renderInitStage(hero, locations, stats, stageName)}
                {this.renderHome(hero, locations, stats, stageName)}
                {this.renderOrderSelector(hero, locations, stageName, orders, roads, this.renderMap)}
                {this.renderRoadMap(hero, locations, stageName, roads, routes, this.renderMap)}
                {this.renderEvent(events, hero, stageName)}
                {this.renderOutcome(events, hero)}
            </div>
        );
    }
}

export default App;
