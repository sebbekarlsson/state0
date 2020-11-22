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
exports.queueSubscribe = exports.queueDispatch = exports.queueHandleAction = exports.queueGetStateRoot = exports.queueGetState = exports.queuePoll = exports.queuePushActionToStorage = exports.queueInitLocalStorage = exports.queueGetSubscribersForAction = exports.queueGetReducersForAction = exports.queueStart = exports.makeQueue = void 0;
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
var queueStart = function (queue, debug, timeOut) {
    if (debug === void 0) { debug = false; }
    if (timeOut === void 0) { timeOut = 6; }
    exports.queueInitLocalStorage(queue);
    if (debug && window) {
        // @ts-ignore
        window.state0 = queue;
    }
    return new Promise(function (resolve, reject) {
        if (setInterval) {
            setInterval(function () { return exports.queuePoll(queue); }, timeOut);
        }
        else {
            reject(new Error("Cannot create event loop"));
        }
    });
};
exports.queueStart = queueStart;
var queueGetReducersForAction = function (queue, action) {
    return queue.reducers.filter(function (reducer) { return reducer.type === action.type; });
};
exports.queueGetReducersForAction = queueGetReducersForAction;
var queueGetSubscribersForAction = function (queue, action) {
    return queue.subscribers.filter(function (reducer) { return reducer.type === action.type; });
};
exports.queueGetSubscribersForAction = queueGetSubscribersForAction;
var queueInitLocalStorage = function (queue, encoder, actions) {
    if (encoder === void 0) { encoder = JSON.stringify; }
    if (actions === void 0) { actions = []; }
    if (window) {
        if (!window.localStorage.getItem(constants_1.STATE0_DEBUG_LOCALSTORAGE_ACTIONS)) {
            window.localStorage.setItem(constants_1.STATE0_DEBUG_LOCALSTORAGE_ACTIONS, encoder(actions));
        }
    }
};
exports.queueInitLocalStorage = queueInitLocalStorage;
var queuePushActionToStorage = function (queue, action, encoder, decoder) {
    if (encoder === void 0) { encoder = JSON.stringify; }
    if (decoder === void 0) { decoder = JSON.parse; }
    if (window) {
        exports.queueInitLocalStorage(queue, encoder, __spreadArrays(decoder(window.localStorage.getItem(constants_1.STATE0_DEBUG_LOCALSTORAGE_ACTIONS)), [
            action,
        ]));
    }
};
exports.queuePushActionToStorage = queuePushActionToStorage;
var queuePoll = function (queue) {
    var actions = __spreadArrays(queue.actions);
    var action = actions.pop();
    queue.actions = actions;
    return exports.queueHandleAction(queue, action);
};
exports.queuePoll = queuePoll;
var queueGetState = function (queue) {
    return queue.state.length ? queue.state[queue.state.length - 1] : {};
};
exports.queueGetState = queueGetState;
var queueGetStateRoot = function (queue, root) { return utils_1.safeGet(exports.queueGetState(queue), root, {}); };
exports.queueGetStateRoot = queueGetStateRoot;
var queueHandleAction = function (queue, action) {
    if (!action)
        return;
    exports.queuePushActionToStorage(queue, action);
    if (action.type == constants_1.STATE0_QUEUE_SUBSCRIBE_ACTION_TYPE && action.subscriber) {
        queue.subscribers = utils_1.uniqueByKey(__spreadArrays(queue.subscribers, [action.subscriber]), "id").map(function (subscriber) {
            // send existing data to subscribers.
            subscriber.trigger(exports.queueGetStateRoot(queue, subscriber.root));
            return subscriber;
        });
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
    return (queue.actions = __spreadArrays(queue.actions, [action]));
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