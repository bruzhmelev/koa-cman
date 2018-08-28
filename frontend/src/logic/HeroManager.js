import { rules } from '../content/entities/rules';
import { rounds } from '../content/entities/rounds';
import { stages } from '../content/entities/stages';
import { roads } from '../content/entities/roads';
import { events } from '../content/entities/events';
import { conditionValidator } from '../logic/ConditionValidator';
import { randomSelector } from '../logic/RandomSelector';
import { historyManager } from '../logic/HistoryManager';
import { taskManager } from '../logic/TaskManager';

    //todo: tidy when was other choice

export const heroManager = {
        createHero: function(){
            return {
                stats: {
                    str: 1,
                    dex: 1,
                    cha: 1
                },
                flags: {},
                tasks: [],
                round: 1,
                trip: 0,
                time: 0,
                speed: 1,
                score: 0,
                points: 5,
                stageId: 'init',
                sourceId: 'pizzeria',
                targetId: 'default',
                roadId: null,
                eventIndex: null,
                allowedChoiceIndexes: null,
                choiceIndex: null,
                outcomeIndex: null,
                history: {}
            };
        },

        // INIT

        allocatePoints: function(hero, pointsToStats){
            if (hero.stageId != 'init'){
                throw new Error('Not allowed');
            }

            var count = this._countPoints(pointsToStats);

            if (count > hero.points){
                throw new Error('Not allowed');
            }

            for (var stat in pointsToStats){
                var points = pointsToStats[stat] || 0;
                hero.stats[stat] = Math.max(0, hero.stats[stat] + points);
            }

            hero.points = Math.max(0, hero.points - count);

            if (!hero.points){
                this._changeStage(hero, 'home');
            }
        },

        _countPoints: function(pointsToStats){
            var count = 0;

            for (var stat in pointsToStats){
                var points = Math.abs(pointsToStats[stat] || 0);
                count += points;
            }

            return count;
        },

        // ORDERS

        startOrders: function(hero){
            if (hero.stageId != 'home'){
                throw new Error('Not allowed');
            }

            this._changeStage(hero, 'orders');
            hero.tasks = [];
        },

        addOrder: function(hero, orderIndex){
            if (hero.stageId != 'orders'){
                throw new Error('Not allowed');
            }

            if (rules.maxOrderCount && hero.tasks.length >= rules.maxOrderCount){
                return;
            }

            var roundInfo = rounds[hero.round - 1];
            var orders = roundInfo.orders;
            var order = orders[orderIndex];
            if (!order){
                throw new Error('no order');
            }

            taskManager.addTask(hero.tasks, {
                orderIndex: orderIndex,
                targetId: order.targetId,
                price: order.price,
                status: 'waiting'
            });
        },

        finishOrders: function(hero){
            if (hero.stageId != 'orders'){
                throw new Error('Not allowed');
            }

            if (hero.tasks.length == 0) {
                throw new Error('Not allowed');
            }

            hero.stageId = 'map';
        },

        /// MAP

        startTrip: function(hero, roadId){
            if (hero.stageId != 'map'){
                throw new Error('Not allowed');
            }

            if (!taskManager.hasWaitingTasks(hero.tasks)){
                throw new Error('Not allowed');
            }

            var road = roads[roadId];
            if (!road){
                throw new Error('Road not found');
            }

            if (!(hero.sourceId == road.sourceId || hero.sourceId == road.targetId)){
                throw new Error('Not allowed');
            }

            hero.stageId = 'road';
            hero.trip++;
            hero.roadId = roadId;
            hero.duration = road.duration;
            hero.flags = {};

            if (hero.sourceId == road.sourceId) {
                hero.sourceId = road.sourceId;
                hero.targetId = road.targetId;
            }
            else {
                hero.sourceId = road.targetId;
                hero.targetId = road.sourceId;
            }

            this.nextEvent(hero);
        },

        goHome: function(hero){
            taskManager.failWaitingTasks(hero.tasks);

            if (rules.autoFine){
                if (taskManager.hasFailedTasks(hero.tasks)){
                    var failedPrice = taskManager.getFailedTaskPrice(hero.tasks);
                    hero.score = Math.max(rules.minScore, hero.score - failedPrice);
                }
            }

            hero.stageId = 'home';
            hero.round++;
            hero.time = 0;
            hero.late = false;
            hero.points++;

            hero.sourceId = 'pizzeria';
            hero.targetId = null;
            hero.roadId = null;
        },

        /// ROAD | LOCATION | CLIENT | HOME

        nextEvent: function(hero){
            this._applyOutcome(hero);

            if (hero.stageId != 'home' && hero.stageId != 'road' && hero.stageId != 'location' && hero.stageId != 'client'){
                throw new Error('Not allowed');
            }

            if (hero.eventIndex != null && hero.outcomeIndex == null){
                throw new Error('Not allowed');
            }

            var eventIndex = this._getEventIndexFromOutcome(hero);
            if (eventIndex != null){
                //todo: we need to change stage if event from other stage
                this._assignEvent(hero, eventIndex);
            }
            else {
                if (hero.stageId == 'home'){
                    if (hero.eventIndex != null){
                        this._assignNoneEvent(hero);
                    }
                    else {
                        this._assignRandomEvent(hero);
                    }
                }
                else if (hero.stageId == 'road') {
                    if (hero.eventIndex != null) {
                        if (taskManager.hasWaitingTasks(hero.tasks, hero.targetId)) {
                            this._changeStage(hero, 'location');
                            this._assignRandomEvent(hero);
                        }
                        else {
                            this._changeStage(hero, 'map');
                            this._assignNoneEvent(hero);
                        }
                    }
                    else {
                        this._assignRandomEvent(hero);
                    }
                }
                else if (hero.stageId == 'location') {
                    if (taskManager.hasWaitingTasks(hero.tasks, hero.targetId)) {
                        this._changeStage(hero, 'client');
                        this._assignRandomEvent(hero);
                    }
                    else {
                        this._changeStage(hero, 'map');
                        this._assignNoneEvent(hero);
                    }
                }
                else if (hero.stageId == 'client') {
                    this._changeStage(hero, 'map');
                    this._assignNoneEvent(hero);
                }
            }
        },

        _changeStage: function(hero, newStageId){
            if (hero.stageId == 'road' && newStageId != 'road'){
                hero.time = Math.round(Math.max(0, hero.time + Math.floor(hero.duration / (hero.speed || 1))));
                hero.speed = 1;
                hero.duration = 0;

                hero.roadId = null;
                hero.sourceId = hero.targetId;
            }

            hero.stageId = newStageId;
        },

        _assignRandomEvent: function(hero){
            var eventIndex = randomSelector.getRandomItemIndex(
                events,
                function (event, eventIndex) {
                    if (event.stage != hero.stageId){
                        return false;
                    }

                    var eventInfo = historyManager.getEventInfo(hero.history, eventIndex);
                    if (event.delay && eventInfo.last.trip && (hero.trip - eventInfo.last.trip <= event.delay)){
                        return false;
                    }

                    return conditionValidator.validate(event.condition, hero);
                },
                function(chance){
                    return conditionValidator.validate(chance.condition, hero);
                }
            );

            this._assignEvent(hero, eventIndex);
        },

        _assignEvent: function(hero, eventIndex){
            var event = events[eventIndex];
            if (!event){
                throw new Error('No event');
            }

            if (hero.stageId == 'road'){
                var timeSpent = _.random(1, hero.duration - 1);
                hero.time = Math.max(0, hero.time + timeSpent);
                hero.duration = Math.max(0, hero.duration - timeSpent);
            }

            this._checkLate(hero);

            hero.eventIndex = eventIndex;
            hero.allowedChoiceIndexes = randomSelector.getRandomItemIndexes(
                event.choices,
                function(choice){
                    return conditionValidator.validate(choice.condition, hero);
                },
                function(chance){
                    return conditionValidator.validate(chance.condition, hero);
                },
                100
            );
            hero.choiceIndex = null;
            hero.outcomeIndex = null;

            var eventInfo = historyManager.getEventInfo(hero.history, eventIndex);
            eventInfo.last.trip = hero.trip;

            if (event.auto){
                this.makeChoice(hero, 0);
            }
        },

        _assignNoneEvent: function(hero){
            this._checkLate(hero);

            hero.eventIndex = null;
            hero.allowedChoiceIndexes = null;
            hero.choiceIndex = null;
            hero.outcomeIndex = null;
        },

        _getEventIndexFromOutcome: function(hero){
            if (hero.outcomeIndex == null) {
                return null;
            }

            var event = events[hero.eventIndex];
            var choice = event.choices[hero.choiceIndex];
            var outcome = choice.outcomes[hero.outcomeIndex];

            if (outcome.back){
                return hero.eventIndex;
            }
            else if (outcome.next){
                return this._findEventIndexByName(outcome.next);
            }
            else {
                return null;
            }
        },

        makeChoice: function(hero, choiceIndex){
            if (hero.eventIndex == null){
                throw new Error('Not allowed');
            }

            if (hero.allowedChoiceIndexes.indexOf(choiceIndex) < 0){
                throw new Error('Not allowed');
            }

            if (hero.outcomeIndex != null){
                throw new Error('Not allowed');
            }

            var event = events[hero.eventIndex];
            var choice = event.choices[choiceIndex];
            var eventInfo = historyManager.getEventInfo(hero.history, hero.eventIndex);

            var goods = eventInfo.goods[choiceIndex] || 0;
            var statsInc = (choice.requirement && choice.requirement.growth) ? (goods * choice.requirement.growth) : 0;

            var outcomeType = conditionValidator.validate(choice.requirement, hero, statsInc) ?
                'good' :
                (eventInfo.last.outcomeType == 'good' ? 'tidy' : 'poor');

            var outcomeIndex = randomSelector.getRandomItemIndex(
                choice.outcomes,
                function(outcome){
                    return (outcome.type == outcomeType || outcome.type == 'ever') &&
                        conditionValidator.validate(outcome.condition, hero);
                },
                function(chance){
                    return conditionValidator.validate(chance.condition, hero);
                },
                100
            );

            hero.choiceIndex = choiceIndex;
            hero.outcomeIndex = outcomeIndex;

            this._checkLate(hero);

            eventInfo.last.outcomeType = outcomeType;
            eventInfo.goods[choiceIndex] = outcomeType == 'good' ? goods + 1 : goods;
            historyManager.setEventInfo(hero.history, hero.eventIndex, eventInfo);
        },

        _applyOutcome: function(hero){
            if (hero.outcomeIndex == null){
                return;
            }

            var event = events[hero.eventIndex];
            var choice = event.choices[hero.choiceIndex];
            var outcome = choice.outcomes[hero.outcomeIndex];
            if (!outcome){
                return;
            }

            var affect = outcome.affect;
            if (!affect){
                return;
            }

            this._applyStatsChange(affect, hero);
            this._applyFlagsChange(affect, hero);
            this._applyTaskChange(affect, hero);
            this._applySpeedChange(affect, hero);
            this._applyTimeChange(affect, hero);
            this._applyScoreChange(affect, hero);
        },

        _applyTaskChange: function(affect, hero){
            if (affect.failAll){
                taskManager.failWaitingTasks(hero.tasks);
            }
            else if (affect.fail){
                taskManager.failTargetTasks(hero.tasks, hero.targetId);
            }
            else if (affect.done){
                taskManager.doneTargetTasks(hero.tasks, hero.targetId);
            }
        },

        _applyScoreChange: function(affect, hero){
            var targetPrice = taskManager.getTargetTaskPrice(hero.tasks, hero.targetId);
            var waitingPrice = taskManager.getWaitingTaskPrice(hero.tasks);

            if (affect.pay) {
                hero.score = Math.max(rules.minScore, hero.score + targetPrice || 0);
            }

            if (affect.fine){
                hero.score = Math.max(rules.minScore, hero.score - targetPrice || 0);
            }

            if (affect.fineAll){
                hero.score = Math.max(rules.minScore, hero.score - waitingPrice || 0);
            }

            if (affect.score){
                hero.score = Math.max(rules.minScore, hero.score + affect.score);
            }

            if (affect.scoref != null && affect.scoref != undefined){
                hero.score = Math.max(rules.minScore, hero.score * affect.scoref);
            }
        },

        _applySpeedChange: function(affect, hero){
            if (affect.speed) {
                hero.speed = Math.max(0.1, hero.speed + affect.speed);
            }
        },

        _applyTimeChange: function(affect, hero){
            if (affect.time) {
                hero.time = Math.max(0, hero.time + affect.time);
            }
        },

        _applyStatsChange: function(affect, hero){
            hero.points = Math.max(0, hero.points + affect.points || 0);

            for (var stat in affect.stats){
                hero.stats[stat] = Math.max(0, hero.stats[stat] + (affect.stats[stat] || 0));
            }
        },

        _applyFlagsChange: function(affect, hero){
            for (var flag in affect.flags){
                hero.flags[flag] = Math.max(0, hero.flags[flag] - (affect.flags[flag] || 0));
            }
        },

        _checkLate: function(hero){
            if (hero.time >= rules.timeLimit){
                // taskManager.failWaitingTasks(hero.tasks);
                hero.late = true;
            }
            else {
                hero.late = false;
            }
        },

        _findEventIndexByName: function(eventName){
            for (var i = 0, len = events.length; i < len; i++){
                var event = events[i];
                if (event.name == eventName){
                    return i;
                }
            }

            return -1;
        }
    }