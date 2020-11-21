"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clickReducer = exports.clickSubscriber = exports.initialState = void 0;
var queue_1 = require("../src/queue");
var CLICK_ACTION = "CLICK_ACTION";
exports.initialState = {
    amount: 0,
};
exports.clickSubscriber = {
    type: CLICK_ACTION,
    trigger: function (data) {
        console.log("Just received some data " + data);
    },
};
exports.clickReducer = {
    type: CLICK_ACTION,
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
var queue = queue_1.makeQueue([exports.clickReducer], exports.initialState, [], [exports.clickSubscriber]);
simulateClick(queue);
simulateClick(queue);
simulateClick(queue);
simulateClick(queue);
//# sourceMappingURL=clickCounter.js.map