export const randomSelector = {
        getRandomItemIndexes: function(items, checkItem, checkChance, defaultChance){
            var indexes = [];

            if (!items){
                return indexes;
            }

            for (var i = 0, len = items.length; i < len; i++){
                var item = items[i];

                if (!checkItem(item, i)) {
                    continue;
                }

                if (item.priority){
                    indexes.push(i);
                    continue;
                }

                var chance = this._getChanceValue(item.chance, checkChance, defaultChance);
                var rnd = _.random(1, 100);

                if (rnd <= chance) {
                    indexes.push(i);
                }
            }

            return indexes;
        },

        getRandomItemIndex: function(items, checkItem, checkChance, defaultChance){
            if (!items){
                return -1;
            }

            var totalChance = this._calcTotalChance(items, checkItem, checkChance, defaultChance);
            var itemIndex = this._chooseRandomIndex(items, totalChance, checkItem, checkChance, defaultChance);
            return itemIndex;
        },

        _calcTotalChance: function(items, checkItem, checkChance, defaultChance){
            var totalChance = 0;

            for (var i = 0, len = items.length; i < len; i++){
                var item = items[i];

                if (!checkItem(item, i)) {
                    continue;
                }

                var chance = this._getChanceValue(item.chance, checkChance, defaultChance);
                totalChance += chance;
            }

            return totalChance;
        },

        _chooseRandomIndex: function(items, totalChance, checkItem, checkChance, defaultChance){
            var rnd = _.random(1, totalChance);
            var chanceSum = 0;
            var foundIndex = -1;

            for (var i = 0, len = items.length; i < len; i++){
                var item = items[i];

                if (!checkItem(item, i)) {
                    continue;
                }

                if (foundIndex < 0){
                    foundIndex = i;
                }

                if (item.priority){
                    foundIndex = i;
                    break;
                }

                var chance = this._getChanceValue(item.chance, checkChance, defaultChance);
                chanceSum += chance;

                if (rnd <= chanceSum){
                    foundIndex = i;
                    break;
                }
            }

            return foundIndex;
        },

        _getChanceValue: function(chances, checkChance, defaultChance){
            defaultChance = defaultChance || 0;

            if (!chances){
                return defaultChance;
            }

            if (_.isArray(chances)){
                for (var i = 0, len = chances.length; i < len; i++){
                    var item = chances[i];
                    if (checkChance(item, i)){
                        return item.value || defaultChance;
                    }
                }

                return 0;
            }
            else {
                if (chances.value !== null && chances.value !== undefined) {
                    return chances.value || defaultChance;
                }
                else {
                    return chances || defaultChance;
                }
            }
        }
    };