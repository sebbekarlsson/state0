"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueSubscribe = exports.queueDispatch = exports.queueHandleAction = exports.queueGetStateRoot = exports.queueGetState = exports.queueNext = exports.queueGetSubscribersForAction = exports.queueGetReducersForAction = exports.makeQueue = void 0;
var utils_1 = require("./utils");
var constants_1 = require("./constants");
var makeQueue = function (state, reducers, subscribers) {
    if (subscribers === void 0) { subscribers = []; }
    return ({
        state: [state],
        reducers: reducers,
        subscribers: subscribers,
        actions: [],
    });
};
exports.makeQueue = makeQueue;
var queueGetReducersForAction = function (queue, action) {
    return queue.reducers.filter(function (reducer) { return reducer.type === action.type; });
};
exports.queueGetReducersForAction = queueGetReducersForAction;
var queueGetSubscribersForAction = function (queue, action) {
    return queue.subscribers.filter(function (reducer) { return reducer.type === action.type; });
};
exports.queueGetSubscribersForAction = queueGetSubscribersForAction;
var queueNext = function (queue) {
    var actions = __spreadArrays(queue.actions);
    var action = actions.pop();
    queue.actions = actions;
    return exports.queueHandleAction(queue, action);
};
exports.queueNext = queueNext;
var queueGetState = function (queue) {
    return queue.state.length ? queue.state[queue.state.length - 1] : {};
};
exports.queueGetState = queueGetState;
var queueGetStateRoot = function (queue, root) { return utils_1.safeGet(exports.queueGetState(queue), root, {}); };
exports.queueGetStateRoot = queueGetStateRoot;
var queueHandleAction = function (queue, action) {
    if (!action)
        return;
    if (action.type == constants_1.STATE0_QUEUE_SUBSCRIBE_ACTION_TYPE && action.subscriber) {
        queue.subscribers = utils_1.uniqueByKey(__spreadArrays(queue.subscribers, [action.subscriber]), "id");
        return;
    }
    var prevState = exports.queueGetState(queue);
    var nextState = exports.queueGetReducersForAction(queue, action).reduce(function (prev, reducer) {
        var _a;
        return (__assign(__assign({}, prev), (_a = {}, _a[reducer.root] = __assign({}, reducer.trigger(exports.queueGetStateRoot(queue, reducer.root), action.payload)), _a)));
    }, prevState);
    exports.queueGetSubscribersForAction(queue, action).forEach(function (subscriber) {
        return subscriber.trigger(utils_1.safeGet(nextState, subscriber.root, {}));
    });
    queue.state.push(nextState);
};
exports.queueHandleAction = queueHandleAction;
var queueDispatch = function (queue, action) {
    var newActions = (queue.actions = __spreadArrays(queue.actions, [action]));
    exports.queueNext(queue);
    return newActions;
};
exports.queueDispatch = queueDispatch;
var queueSubscribe = function (queue, subscriber) {
    return exports.queueDispatch(queue, {
        type: constants_1.STATE0_QUEUE_SUBSCRIBE_ACTION_TYPE,
        subscriber: subscriber,
        payload: null,
    });
};
exports.queueSubscribe = queueSubscribe;
//# sourceMappingURL=queue.js.map