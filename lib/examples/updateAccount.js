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
var dispatcher_1 = require("@state0/dispatcher");
var dispatcher = new dispatcher_1.Dispatcher();
dispatcher.when("SOMETHING_HAPPENED", function (prevState, nextState) {
    return __assign(__assign({}, nextState), { name: "John" });
});
dispatcher.emit("SOMETHING_HAPPENED", ({ age: 34 }));
dispatcher.emit("SOMETHING_HAPPENED", ({ age: 36 }));
console.log(dispatcher.nextState);
//# sourceMappingURL=updateAccount.js.map