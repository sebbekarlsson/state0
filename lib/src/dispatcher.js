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
exports.Dispatcher = void 0;
var getPathElements = function (stateEvent) {
    return stateEvent.split("/");
};
var applyValue = function (breadCrumbs) {
    var _a;
    return _a = {},
        _a[breadCrumbs.pop()] = breadCrumbs.length == 1 ? breadCrumbs[0] : applyValue(breadCrumbs),
        _a;
};
var Dispatcher = /** @class */ (function () {
    function Dispatcher(onStateChange) {
        if (onStateChange === void 0) { onStateChange = function (state) { return state; }; }
        this.listeners = {};
        this.prevState = {};
        this.nextState = {};
        this.state = {};
        this.onStateChange = onStateChange;
    }
    Dispatcher.prototype.when = function (stateEvent, then) {
        this.listeners[stateEvent] = __spreadArrays((this.listeners[stateEvent] || []), [then]);
    };
    Dispatcher.prototype.emit = function (stateEvent, payload) {
        var _this = this;
        var pathElements = getPathElements(stateEvent);
        var rootElements = pathElements;
        this.nextState = this.listeners[stateEvent].reduce(function (prev, then) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[stateEvent] = then((stateEvent in _this.prevState && _this.prevState[stateEvent]) ||
                undefined, payload), _a)));
        }, {});
        this.prevState[stateEvent] = payload;
        return this.finishEmit(__assign(__assign({}, this.state), applyValue(__spreadArrays(rootElements.slice(0, rootElements.length - 1), [
            this.prevState[stateEvent],
        ]).reverse())));
    };
    Dispatcher.prototype.finishEmit = function (nextState) {
        return this.onStateChange((this.state = nextState));
    };
    return Dispatcher;
}());
exports.Dispatcher = Dispatcher;
//# sourceMappingURL=dispatcher.js.map