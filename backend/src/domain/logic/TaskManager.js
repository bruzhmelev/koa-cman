export const taskManager = {
        addTask: function(tasks, task){
            if (!task){
                return;
            }

            if (!this.checkDuplicateTask(tasks, task)){
                tasks.push(task);
            }
        },

        checkDuplicateTask: function(tasks, task){
            if (!task){
                return false;
            }

            for (var i = 0, len = tasks.length; i < len; i++){
                var item = tasks[i];
                if (item.orderIndex == task.orderIndex){
                    return true;
                }
            }

            return false;
        },

        failWaitingTasks: function(tasks){
            this._updateStatusByFilter(tasks, 'failed', 'waiting', null);
        },

        failTargetTasks: function(tasks, targetId){
            this._updateStatusByFilter(tasks, 'failed', null, targetId);
        },

        doneTargetTasks: function(tasks, targetId){
            this._updateStatusByFilter(tasks, 'done', null, targetId);
        },

        hasWaitingTasks: function(tasks, targetId){
            return this._getTaskCountByFilter(tasks, 'waiting', targetId) > 0;
        },

        hasFailedTasks: function(tasks){
            return this._getTaskCountByFilter(tasks, 'failed', null) > 0;
        },

        getWaitingTaskPrice: function(tasks){
            return this._getTaskPriceByFilter(tasks, 'waiting', null);
        },

        getFailedTaskPrice: function(tasks){
            return this._getTaskPriceByFilter(tasks, 'failed', null);
        },

        getTargetTaskPrice: function(tasks, targetId){
            return this._getTaskPriceByFilter(tasks, null, targetId);
        },

        _getTaskCountByFilter: function(tasks, status, targetId){
            if (!tasks){
                return 0;
            }

            var count = 0;

            for (var i = 0, len = tasks.length; i < len; i++){
                var task = tasks[i];
                if (this._isMatchedTask(task, status, targetId)) {
                    count++;
                }
            }

            return count;
        },

        _getTaskPriceByFilter: function(tasks, status, targetId){
            if (!tasks){
                return;
            }

            var total = 0;

            for (var i = 0, len = tasks.length; i < len; i++){
                var task = tasks[i];
                if (this._isMatchedTask(task, status, targetId)) {
                    total += task.price || 0;
                }
            }

            return total;
        },

        _updateStatusByFilter: function(tasks, newStatus, status, targetId){
            if (!tasks){
                return;
            }

            for (var i = 0, len = tasks.length; i < len; i++){
                var task = tasks[i];
                if (this._isMatchedTask(task, status, targetId)) {
                    task.status = newStatus;
                }
            }
        },

        _isMatchedTask: function(task, status, targetId){
            return (((status && task.status == status) || !status) && ((targetId && task.targetId == targetId) || !targetId));
        }
    };