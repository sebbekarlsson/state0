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
Object.defineProperty(exports, "__esModule", { value: true });
var dispatcher_1 = require("../src/dispatcher");
var SOME_RANDOM_USER_ID = "abc123";
var dispatcher = new dispatcher_1.Dispatcher(function (state) {
    // Store the state wherever you want, state0 couldn't care less.
    // The state always exists in dispatcher.state however.
    console.log(state); // // { user: { abc123: { email: 'john.doe@doecompanyforever.com' } } }
});
// define some action types
var updateUserAction = function (userId) { return "user/" + userId + "/update"; };
// listen for updates
// this one actually returns a modified state.
dispatcher.when(updateUserAction(SOME_RANDOM_USER_ID), function (prevState, nextState) {
    return __assign(__assign({}, prevState), nextState);
});
// this one just logs the new state,
// to be used in a react component for eample.
dispatcher.when(updateUserAction(SOME_RANDOM_USER_ID), function (prevState, nextState) {
    console.log(nextState); // { email: 'john.doe@doecompanyforever.com' }
});
// emit an event
dispatcher.emit(updateUserAction(SOME_RANDOM_USER_ID), {
    email: "john.doe@doecompanyforever.com",
});
//# sourceMappingURL=user.js.map