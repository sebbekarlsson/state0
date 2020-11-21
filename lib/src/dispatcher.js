"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dispatcher = void 0;
var checkPath = function (stateEvent) {
  if (!stateEvent) {
    throw new Error("Cannot pass an empty stateEvent / path");
  }
  if (!stateEvent.includes("/")) {
    throw new Error("stateEvent / path needs at least one level of depth.");
  }
  if (stateEvent[stateEvent.length - 1] === "/") {
    throw new Error("stateEvent / path cannot end with `/`");
  }
};
var getPathElements = function (stateEvent) {
  checkPath(stateEvent);
  return stateEvent.split("/");
};
var applyValue = function (breadCrumbs) {
  var _a;
  return (
    (_a = {}),
    (_a[breadCrumbs.pop()] =
      breadCrumbs.length == 1 ? breadCrumbs[0] : applyValue(breadCrumbs)),
    _a
  );
};
var resolveObjectPath = function (path, obj, separator) {
  if (separator === void 0) {
    separator = "/";
  }
  var properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce(function (prev, curr) {
    return prev && prev[curr];
  }, obj);
};
var Dispatcher = /** @class */ (function () {
  function Dispatcher(onStateChange) {
    if (onStateChange === void 0) {
      onStateChange = function (state) {
        return state;
      };
    }
    this.listeners = {};
    this.ons = {};
    this.prevState = {};
    this.nextState = {};
    this.state = {};
    this.onStateChange = onStateChange;
  }
  Dispatcher.prototype.when = function (stateEvent, then) {
    checkPath(stateEvent);
    this.listeners[stateEvent] = __spreadArrays(
      stateEvent in this.listeners ? this.listeners[stateEvent] || [] : [],
      [then]
    ).filter(function (listener) {
      return !!listener;
    });
    return then;
  };
  Dispatcher.prototype.on = function (stateEvent, then) {
    checkPath(stateEvent);
    this.ons[stateEvent] = __spreadArrays(
      stateEvent in this.ons ? this.ons[stateEvent] || [] : [],
      [then]
    ).filter(function (listener) {
      return !!listener;
    });
    return then;
  };
  Dispatcher.prototype.emit = function (stateEvent, payload) {
    var _this = this;
    checkPath(stateEvent);
    var pathElements = getPathElements(stateEvent);
    this.nextState =
      stateEvent in this.listeners
        ? (this.listeners[stateEvent] || []).reduce(function (prev, then) {
            var _a;
            return __assign(
              __assign({}, prev),
              ((_a = {}),
              (_a[stateEvent] =
                then(
                  (stateEvent in _this.prevState &&
                    _this.prevState[stateEvent]) ||
                    _this.search(stateEvent + "/init") ||
                    prev[stateEvent],
                  payload
                ) || prev[stateEvent]),
              _a)
            );
          }, this.prevState)
        : this.prevState;
    var emitResult = this.finishEmit(
      __assign(
        __assign({}, this.state),
        applyValue(
          __spreadArrays(
            pathElements.slice(
              0,
              pathElements.length -
                (pathElements[pathElements.length - 1] === "init" ? 2 : 1)
            ),
            [this.nextState[stateEvent] || {}]
          ).reverse()
        )
      )
    );
    // broadcast to all readers
    stateEvent in this.ons
      ? (this.ons[stateEvent] || []).reduce(function (prev, then) {
          var _a;
          return __assign(
            __assign({}, prev),
            ((_a = {}),
            (_a[stateEvent] =
              then(
                (stateEvent in _this.prevState &&
                  _this.prevState[stateEvent]) ||
                  _this.search(stateEvent + "/init") ||
                  prev[stateEvent],
                _this.search("" + stateEvent)
              ) || prev[stateEvent]),
            _a)
          );
        }, this.prevState)
      : this.prevState;
    return emitResult;
  };
  Dispatcher.prototype.finishEmit = function (nextState) {
    this.prevState = this.nextState;
    return this.onStateChange((this.state = nextState));
  };
  Dispatcher.prototype.search = function (path) {
    checkPath(path);
    var parts = path.split("/");
    return resolveObjectPath(
      parts.slice(0, parts.length - 1).join("/"),
      this.state,
      "/"
    );
  };
  Dispatcher.prototype.setInitialState = function (path, state) {
    checkPath(path);
    this.prevState[path] = state;
    this.emit(path + "/init", state);
  };
  return Dispatcher;
})();
exports.Dispatcher = Dispatcher;
//# sourceMappingURL=dispatcher.js.map
