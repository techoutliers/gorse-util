"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
(function () {
    index_1.default.init({ feedUrl: "feed", directoryUrl: "dir" });
    console.log(index_1.default.directoryUrl);
})();
require("./a2");
