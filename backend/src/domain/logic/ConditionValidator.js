import { stages } from '../content/entities/stages';
import { roads } from '../content/entities/roads';
import { events } from '../content/entities/events';

export const conditionValidator = {
        validate: function(condition, hero, visitCount){
            if (!condition){
                return true;
            }

            if (!hero){
                return false;
            }

            if (_.isArray(condition)){
                for (var i = 0, len = condition.length; i < len; i++){
                    if (this._validateCondition(condition[i], hero, visitCount)){
                        return true;
                    }
                }

                return false;
            }
            else {
                return this._validateCondition(condition, hero, visitCount);
            }
        },

        _validateCondition: function(condition, hero, visitCount){
            return this._validateBoolean(condition.late, hero.late) &&
                this._validateEqualsOrExists(condition.source, hero.sourceId) &&
                this._validateEqualsOrExists(condition.target, hero.targetId) &&
                this._validateEqualsOrExists(condition.road, hero.roadId) &&
                // this._validateMinOrBetween(condition.level, hero.level) &&
                this._validateMinOrBetween(condition.points, hero.points) &&
                this._validateMinOrBetween(condition.round, hero.round) &&
                this._validateMinOrBetween(condition.trip, hero.trip) &&
                // this._validateMinOrBetween(condition.visit, hero.visit) &&
                // this._validateMinOrBetween(condition.trial, hero.trial) &&
                this._validateHashmap(condition.stats, hero.stats, visitCount) &&
                this._validateHashmap(condition.flags, hero.flags);
        },

        _validateHashmap: function(expected, value, inc){
            if (!expected) {
                return true;
            }

            if (!value){
                return false;
            }

            for (var name in expected) {
                if (!this._validateMinOrBetween(expected[name], value[name], inc)){
                    return false;
                }
            }

            return true;
        },

        _validateBoolean: function(expected, value){
            if (expected == null || expected == undefined) {
                return true;
            }

            if (expected){
                return !!value;
            }
            else {
                return !value;
            }
        },

        _validateEqualsOrExists: function(range, value){
            if (range === null || range === undefined) {
                return true;
            }

            if (_.isArray(range)){
                return range.indexOf(value) >= 0;
            }
            else {
                return value == range;
            }
        },

        _validateMinOrBetween: function(range, value, inc){
            if (range === null || range === undefined) {
                return true;
            }

            inc = inc || 0;

            if (_.isArray(range)){
                if (range.length > 1){
                    return value >= range[0] + inc && value <= range[1] + inc;
                }
                else if (range.length == 1) {
                    return value >= range[0] + inc;
                }
                else {
                    return true;
                }
            }
            else {
                return value >= range + inc;
            }
        }
    };