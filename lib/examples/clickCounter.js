"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.clickReducer = exports.clickSubscriber = exports.initialState = void 0;
var queue_1 = require("../src/queue");
var CLICK_ACTION = "CLICK_ACTION";
var CLICK_ROOT = "click";
// Our initial state
exports.initialState = (_a = {},
    _a[CLICK_ROOT] = {
        amount: 0,
    },
    _a);
// read-only subscriber
exports.clickSubscriber = {
    type: CLICK_ACTION,
    root: CLICK_ROOT,
    id: "onClick",
    trigger: function (data) {
        console.log("Just received some data " + data);
    },
};
// read / write reducer
exports.clickReducer = {
    type: CLICK_ACTION,
    root: CLICK_ROOT,
    trigger: function (prevState, nextState) {
        return { amount: prevState.amount + nextState.amount };
    },
};
var simulateClick = function (queue) {
    return queue_1.queueDispatch(queue, {
        type: CLICK_ACTION,
        payload: { amount: 1 },
    });
};
var queue = queue_1.makeQueue(exports.initialState, [exports.clickReducer], [exports.clickSubscriber]);
// simulate some clicks
simulateClick(queue);
simulateClick(queue);
simulateClick(queue);
simulateClick(queue);
//# sourceMappingURL=clickCounter.js.map