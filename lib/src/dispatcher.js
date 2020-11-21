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
var utils_1 = require("./utils");
var Dispatcher = /** @class */ (function () {
    function Dispatcher(onStateChange) {
        if (onStateChange === void 0) { onStateChange = function (state) { return state; }; }
        this.listeners = {};
        this.ons = {};
        this.prevState = {};
        this.nextState = {};
        this.state = {};
        this.onStateChange = onStateChange;
    }
    Dispatcher.prototype.when = function (stateEvent, then) {
        utils_1.checkPath(stateEvent);
        this.listeners[stateEvent] = __spreadArrays((stateEvent in this.listeners ? this.listeners[stateEvent] || [] : []), [
            then,
        ]).filter(function (listener) { return !!listener; });
        return then;
    };
    Dispatcher.prototype.on = function (stateEvent, then) {
        utils_1.checkPath(stateEvent);
        this.ons[stateEvent] = __spreadArrays((stateEvent in this.ons ? this.ons[stateEvent] || [] : []), [
            then,
        ]).filter(function (listener) { return !!listener; });
        return then;
    };
    Dispatcher.prototype.emit = function (stateEvent, payload) {
        var _this = this;
        utils_1.checkPath(stateEvent);
        var pathElements = utils_1.getPathElements(stateEvent);
        this.nextState =
            stateEvent in this.listeners
                ? (this.listeners[stateEvent] || []).reduce(function (prev, then) {
                    var _a;
                    return (__assign(__assign({}, prev), (_a = {}, _a[stateEvent] = then((stateEvent in _this.prevState &&
                        _this.prevState[stateEvent]) ||
                        _this.search(stateEvent + "/init") ||
                        prev[stateEvent], payload) || prev[stateEvent], _a)));
                }, this.prevState)
                : this.prevState;
        var emitResult = this.finishEmit(__assign(__assign({}, this.state), utils_1.applyValue(__spreadArrays(pathElements.slice(0, pathElements.length -
            (pathElements[pathElements.length - 1] === "init" ? 2 : 1)), [
            this.nextState[stateEvent] || {},
        ]).reverse())));
        // broadcast to all readers
        stateEvent in this.ons
            ? (this.ons[stateEvent] || []).reduce(function (prev, then) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[stateEvent] = then((stateEvent in _this.prevState && _this.prevState[stateEvent]) ||
                    _this.search(stateEvent + "/init") ||
                    prev[stateEvent], _this.search("" + stateEvent)) || prev[stateEvent], _a)));
            }, this.prevState)
            : this.prevState;
        return emitResult;
    };
    Dispatcher.prototype.finishEmit = function (nextState) {
        this.prevState = this.nextState;
        return this.onStateChange((this.state = nextState));
    };
    Dispatcher.prototype.search = function (path) {
        utils_1.checkPath(path);
        var parts = path.split("/");
        return utils_1.resolveObjectPath(parts.slice(0, parts.length - 1).join("/"), this.state, "/");
    };
    Dispatcher.prototype.setInitialState = function (path, state) {
        utils_1.checkPath(path);
        this.prevState[path] = state;
        this.emit(path + "/init", state);
    };
    return Dispatcher;
}());
exports.Dispatcher = Dispatcher;
//# sourceMappingURL=dispatcher.js.map