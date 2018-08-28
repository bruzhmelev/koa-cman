export const historyManager = {
        getEventInfo: function(history, eventIndex){
            return history[eventIndex] || this._createEventInfo();
        },

        setEventInfo: function(history, eventIndex, eventInfo){
            history[eventIndex] = eventInfo;
        },

        _createEventInfo: function(){
            return {
                //visit: 0,
                // choiceTrials: {}
                goods: {},
                last: {
                    outcomeType: null,
                    choiceIndex: null,
                    trip: null
                }
            };
        }
    };