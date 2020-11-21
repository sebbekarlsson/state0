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
exports.queueSubscribe = exports.queueDispatch = exports.queueStepNext = exports.makeQueue = void 0;
var utils_1 = require("./utils");
var makeQueue = function (reducers, state, actions, subscribers) {
    if (actions === void 0) { actions = []; }
    if (subscribers === void 0) { subscribers = []; }
    return ({
        actions: actions,
        reducers: reducers,
        subscribers: subscribers,
        state: state || {},
    });
};
exports.makeQueue = makeQueue;
var queueStepNext = function (queue) {
    var newActions = __spreadArrays(queue.actions);
    var action = newActions.pop();
    var nextReducersState = action
        ? queue.reducers
            .filter(function (reducer) { return reducer.type === action.type; })
            .reduce(function (prev, red) { return (__assign(__assign({}, prev), red.trigger(queue.state, action.payload))); }, {})
        : {};
    var nextState = {
        actions: newActions,
        reducers: queue.reducers,
        subscribers: queue.subscribers,
        state: __assign(__assign({}, queue.state), nextReducersState),
    };
    action &&
        queue.subscribers
            .filter(function (subscriber) { return subscriber.type === action.type; })
            .forEach(function (subscriber) { return subscriber.trigger(nextReducersState); });
    if (queue.ref) {
        queue.ref.state = nextState.state;
        queue.ref.actions = nextState.actions;
        queue.ref.subscribers = nextState.subscribers;
        queue.ref.reducers = nextState.reducers;
    }
    return nextState;
};
exports.queueStepNext = queueStepNext;
var queueDispatch = function (queue, action) { return (__assign({}, exports.queueStepNext(__assign(__assign({}, queue), { ref: queue, actions: __spreadArrays(queue.actions, [action]) })))); };
exports.queueDispatch = queueDispatch;
var queueSubscribe = function (queue, subscribers) {
    var nextState = __assign(__assign({}, queue), { subscribers: utils_1.uniqueByKey(__spreadArrays(queue.subscribers, subscribers), "type") });
    queue.state = nextState.state;
    queue.actions = nextState.actions;
    queue.subscribers = nextState.subscribers;
    queue.reducers = nextState.reducers;
    return nextState;
};
exports.queueSubscribe = queueSubscribe;
//# sourceMappingURL=queue.js.map