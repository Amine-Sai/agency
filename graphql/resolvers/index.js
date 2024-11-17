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
var employee_1 = require("./employee");
var request_1 = require("./request");
var service_1 = require("./service");
var user_1 = require("./user");
var resolvers = {
    Query: __assign(__assign(__assign(__assign({}, employee_1.default.Query), request_1.default.Query), service_1.default.Query), user_1.default.Query),
    Mutation: __assign(__assign({}, request_1.default.Mutation), service_1.default.Mutation),
};
exports.default = resolvers;
