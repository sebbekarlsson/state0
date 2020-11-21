"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveObjectPath = exports.applyValue = exports.getPathElements = exports.checkPath = void 0;
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
    return [];
};
exports.checkPath = checkPath;
var getPathElements = function (stateEvent) {
    return exports.checkPath(stateEvent) && stateEvent.split("/");
};
exports.getPathElements = getPathElements;
/**
 * Construct a new object from a list of breadcrumbs (strings),
 * the tip becomes the value in the last node.
 */
var applyValue = function (breadCrumbs) {
    var _a;
    return (_a = {},
        _a[breadCrumbs.pop()] = breadCrumbs.length == 1 ? breadCrumbs[0] : exports.applyValue(breadCrumbs),
        _a);
};
exports.applyValue = applyValue;
/**
 * Get value in object by path
 * some/value/in/object
 * or
 * some.value.in.object
 */
var resolveObjectPath = function (path, obj, separator) {
    if (separator === void 0) { separator = "/"; }
    return (Array.isArray(path) ? path : path.split(separator)).reduce(function (prev, curr) { return prev && prev[curr]; }, obj);
};
exports.resolveObjectPath = resolveObjectPath;
//# sourceMappingURL=utils.js.map