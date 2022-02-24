"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var GorseUtil = /** @class */ (function () {
    function GorseUtil() {
        this.feedUrl = null;
        this.directoryUrl = null;
        this.logger = undefined;
    }
    GorseUtil.prototype.init = function (args) {
        this.feedUrl = args.feedUrl;
        this.directoryUrl = args.directoryUrl;
        this.logger = args.logger;
    };
    GorseUtil.prototype.feed_deleteAVibe = function (args) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var vibeId, likedByUserIds, i, result;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info({ args: args }, "feed_deleteAVibe");
                        vibeId = args.vibeId, likedByUserIds = args.likedByUserIds;
                        return [4 /*yield*/, axios_1.default.delete(this.feedUrl + "item/".concat(vibeId)).catch(function (e) {
                                var _a;
                                (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: e }, "failed to delete vibe from gorse feed");
                            })];
                    case 1:
                        _b.sent();
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < likedByUserIds.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, axios_1.default
                                .delete(this.feedUrl + "feedback/".concat(likedByUserIds[i], "/").concat(vibeId))
                                .catch(function (e) {
                                var _a;
                                (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: e }, "failed to delete vibe feedback from gorse feed");
                            })];
                    case 3:
                        result = _b.sent();
                        _b.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    GorseUtil.prototype.feed_toggleSecretUser = function (args) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var vibes, status, items, i, item, headers, result;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info({ args: args }, "feed_toggleSecretUser");
                        vibes = args.vibes, status = args.status;
                        items = [];
                        for (i = 0; i < vibes.length; i++) {
                            item = {
                                itemid: vibes[i]._id,
                                status: status,
                                adminstatus: "",
                            };
                            items.push(item);
                        }
                        headers = { "Content-Type": "application/json" };
                        return [4 /*yield*/, axios_1.default
                                .patch(this.feedUrl + "item", items, {
                                headers: headers,
                            })
                                .catch(function (err) {
                                var _a;
                                (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to patch vibe status to ".concat(status, " in gorse feed"));
                            })];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GorseUtil.prototype.feed_deactivate = function (args) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var userId, vibes, likeIds, ownLikes, p1, i, promise, p2, j, promise, i, promise;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = args.userId, vibes = args.vibes, likeIds = args.likeIds, ownLikes = args.ownLikes;
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info({ args: args }, "feed_deactivate");
                        return [4 /*yield*/, axios_1.default.delete(this.feedUrl + "user/".concat(userId)).catch(function (err) {
                                var _a;
                                (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete user in gorse feed");
                            })];
                    case 1:
                        _b.sent();
                        p1 = [];
                        for (i = 0; i < vibes.length; i++) {
                            promise = axios_1.default.delete(this.feedUrl + "item/".concat(vibes[i]._id));
                            p1.push(promise);
                        }
                        Promise.all(p1)
                            .then(function (values) {
                            var _a;
                            (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ values: values }, "successfully deleted items from gorse feed");
                        })
                            .catch(function (err) {
                            var _a;
                            (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete items (feed) in gorse feed");
                        });
                        p2 = [];
                        // Here feedbacks to user's own vibes are being deleted from gorse
                        for (j = 0; j < likeIds.length; j++) {
                            promise = axios_1.default.delete(this.feedUrl + "feedback/".concat(likeIds[j].userId, "/").concat(likeIds[j].ref));
                            p2.push(promise);
                        }
                        // Here feedbacks user has given to other vibes are being deleted from gorse
                        for (i = 0; i < ownLikes.length; i++) {
                            promise = axios_1.default.delete(this.feedUrl +
                                "feedback/".concat(ownLikes[i].userId.toString(), "/").concat(ownLikes[i].ref));
                            p2.push(promise);
                        }
                        Promise.all(p2)
                            .then(function (values) {
                            var _a;
                            (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ values: values }, "successfully deleted feedbacks from gorse feed");
                        })
                            .catch(function (err) {
                            var _a;
                            (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete feedbacks (feed) in gorse feed");
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GorseUtil.prototype.feed_setAccountStatus = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, profileStatus, userVibes, likes, headers, hold, user_params, params1, i, merge, param, params2, i, param;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = args.userId, profileStatus = args.profileStatus, userVibes = args.userVibes, likes = args.likes;
                        headers = { "Content-Type": "application/json" };
                        hold = [""];
                        user_params = {
                            Userid: userId,
                            Comment: "",
                            Labels: hold,
                            Subscribe: hold,
                            Status: "public",
                        };
                        return [4 /*yield*/, axios_1.default
                                .post(this.feedUrl + "user", user_params, { headers: headers })
                                .then(function (d) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully added user in feed_setAccountStatus");
                            })
                                .catch(function (e) { var _a; return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: e }, "failed to post user in gorse feed"); })];
                    case 1:
                        _a.sent();
                        params1 = [];
                        for (i = 0; i < userVibes.length; i++) {
                            merge = [];
                            if (userVibes[i].vibeTags) {
                                merge = __spreadArray(__spreadArray([], userVibes[i].vibeTags, true), userVibes[i].hashtags, true);
                            }
                            else {
                                merge = __spreadArray([], userVibes[i].hashtags, true);
                            }
                            param = {
                                Itemid: userVibes[i]._id.toString(),
                                Labels: merge,
                                Comment: userVibes[i].description
                                    ? userVibes[i].description
                                    : "some comment",
                                Timestamp: userVibes[i].createdAt,
                                Userid: userId,
                                Status: profileStatus === "public" ? "public" : "private",
                                AdminStatus: userVibes[i].adminHidden ? "hidden" : "unhidden",
                            };
                            params1.push(param);
                        }
                        return [4 /*yield*/, axios_1.default
                                .post(this.feedUrl + "items", params1, { headers: headers })
                                .then(function (d) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully added items in feed_setAccountStatus");
                            })
                                .catch(function (err) {
                                var _a;
                                (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post vibes in gorse feed");
                            })];
                    case 2:
                        _a.sent();
                        params2 = [];
                        for (i = 0; i < likes.length; i++) {
                            param = {
                                UserId: likes[i].userId.toString(),
                                ItemId: likes[i].ref,
                                Feedbacktype: "like",
                                Timestamp: likes[i].createdAt,
                                Comment: "like feedback",
                            };
                            params2.push(param);
                        }
                        return [4 /*yield*/, axios_1.default
                                .post(this.feedUrl + "feedback", params2, {
                                headers: headers,
                            })
                                .then(function (d) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully added feedbacks in feed_setAccountStatus");
                            })
                                .catch(function (err) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post feedbacks in feed_setAccountStatus");
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GorseUtil.prototype.feed_deleteUser = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, vibes, user_result, p, i, promise;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = args.userId, vibes = args.vibes;
                        return [4 /*yield*/, axios_1.default
                                .delete(this.feedUrl + "user/".concat(userId))
                                .then(function (d) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully deleted user from gorse in feed_deleteUser");
                            })
                                .catch(function (err) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete user from gorse in feed_deleteUser");
                            })];
                    case 1:
                        user_result = _a.sent();
                        p = [];
                        for (i = 0; i < vibes.length; i++) {
                            promise = axios_1.default.delete(this.feedUrl + "item/".concat(vibes[i]._id.toString()));
                            p.push(promise);
                        }
                        Promise.all(p)
                            .then(function (d) {
                            var _a;
                            return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully deleted items (vibes) from gorse in feed_deleteUser");
                        })
                            .catch(function (err) {
                            var _a;
                            return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete items (vibes) from gorse in feed_deleteUser");
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GorseUtil.prototype.feed_recordScreenshot = function (args) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var userId, vibes, p1, i, promise;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = args.userId, vibes = args.vibes;
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info({ args: args }, "feed_recordScreenshot");
                        return [4 /*yield*/, axios_1.default
                                .delete(this.feedUrl + "user/".concat(userId))
                                .then(function (d) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully deleted user from gorse in feed_recordScreenshot");
                            })
                                .catch(function (err) {
                                var _a;
                                (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete user in feed_recordScreenshot in gorse feed");
                            })];
                    case 1:
                        _b.sent();
                        p1 = [];
                        for (i = 0; i < vibes.length; i++) {
                            promise = axios_1.default.delete(this.feedUrl + "item/".concat(vibes[i]._id));
                            p1.push(promise);
                        }
                        Promise.all(p1)
                            .then(function (values) {
                            var _a;
                            (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ values: values }, "successfully deleted items in feed_recordScreenshot from gorse feed");
                        })
                            .catch(function (err) {
                            var _a;
                            (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete items (feed) in feed_recordScreenshot in gorse feed");
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GorseUtil.prototype.feed_admin_activate = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, userVibes, allLikes, profileStatus, headers, hold, user_params, params1, i, merge, param, params2, i, param;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = args.userId, userVibes = args.userVibes, allLikes = args.allLikes, profileStatus = args.profileStatus;
                        headers = { "Content-Type": "application/json" };
                        hold = [""];
                        user_params = {
                            Userid: userId,
                            Comment: "",
                            Labels: hold,
                            Subscribe: hold,
                            Status: profileStatus || "public",
                        };
                        return [4 /*yield*/, axios_1.default
                                .post(this.feedUrl + "user", user_params, { headers: headers })
                                .then(function (d) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully added user in feed_admin_activate");
                            })
                                .catch(function (e) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: e }, "failed to post user in feed_admin_activate in gorse feed");
                            })];
                    case 1:
                        _a.sent();
                        params1 = [];
                        for (i = 0; i < userVibes.length; i++) {
                            merge = [];
                            if (userVibes[i].vibeTags) {
                                merge = __spreadArray(__spreadArray([], userVibes[i].vibeTags, true), userVibes[i].hashtags, true);
                            }
                            else {
                                merge = __spreadArray([], userVibes[i].hashtags, true);
                            }
                            param = {
                                Itemid: userVibes[i]._id.toString(),
                                Labels: merge,
                                Comment: userVibes[i].description
                                    ? userVibes[i].description
                                    : "some comment",
                                Timestamp: userVibes[i].createdAt,
                                Userid: userId,
                                Status: profileStatus === "public" ? "public" : "private",
                                AdminStatus: userVibes[i].adminHidden ? "hidden" : "unhidden",
                            };
                            params1.push(param);
                        }
                        return [4 /*yield*/, axios_1.default
                                .post(this.feedUrl + "items", params1, { headers: headers })
                                .then(function (d) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully added items in feed_admin_activate in gorse feed");
                            })
                                .catch(function (err) {
                                var _a;
                                (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post vibes in gorse feed");
                            })];
                    case 2:
                        _a.sent();
                        params2 = [];
                        for (i = 0; i < allLikes.length; i++) {
                            param = {
                                UserId: allLikes[i].userId.toString(),
                                ItemId: allLikes[i].ref,
                                Feedbacktype: "like",
                                Timestamp: allLikes[i].createdAt,
                                Comment: "like feedback",
                            };
                            params2.push(param);
                        }
                        return [4 /*yield*/, axios_1.default
                                .post(this.feedUrl + "feedback", params2, {
                                headers: headers,
                            })
                                .then(function (d) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully added feedbacks in feed_admin_activate in gorse feed");
                            })
                                .catch(function (err) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post feedbacks in feed_admin_activate in gorse feed");
                            })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GorseUtil.prototype.feed_admin_hideVibeAsAdmin = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var vibeId, adminStatus, headers, item, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vibeId = args.vibeId, adminStatus = args.adminStatus;
                        headers = { "Content-Type": "application/json" };
                        item = [
                            {
                                itemid: vibeId,
                                adminstatus: adminStatus,
                                status: "",
                            },
                        ];
                        return [4 /*yield*/, axios_1.default
                                .patch(this.feedUrl + "item", item, {
                                headers: headers,
                            })
                                .then(function (d) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully updated vibe status in feed_admin_hideVibeAsAdmin in gorse feed");
                            })
                                .catch(function (err) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to updated vibe status in feed_admin_hideVibeAsAdmin in gorse feed");
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GorseUtil.prototype.feed_admin_deleteVibeAsAdmin = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var vibeId, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        vibeId = args.vibeId;
                        return [4 /*yield*/, axios_1.default
                                .delete(this.feedUrl + "item/".concat(vibeId))
                                .then(function (d) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully deleted vibe (item) in feed_admin_deleteVibeAsAdmin in gorse feed");
                            })
                                .catch(function (err) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete vibe (item) in feed_admin_deleteVibeAsAdmin in gorse feed");
                            })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GorseUtil.prototype.feed_admin_suspendIt = function (args) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var vibeId, action, headers, result, vibe, likes, profileStatus, userId, merge, params, params2, i, param;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        vibeId = args.vibeId, action = args.action;
                        headers = {
                            "Content-Type": "application/json",
                        };
                        if (!(action === "delete")) return [3 /*break*/, 2];
                        return [4 /*yield*/, axios_1.default
                                .delete(this.feedUrl + "item/".concat(vibeId))
                                .then(function (d) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully deleted vibe (item) in feed_admin_deleteVibeAsAdmin in gorse feed");
                            })
                                .catch(function (err) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete vibe (item) in feed_admin_deleteVibeAsAdmin in gorse feed");
                            })];
                    case 1:
                        result = _b.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        if (!(action === "reinstate")) return [3 /*break*/, 5];
                        vibe = args.vibe, likes = args.likes, profileStatus = args.profileStatus, userId = args.userId;
                        merge = [];
                        if (vibe.vibeTags) {
                            merge = __spreadArray(__spreadArray([], vibe.vibeTags, true), vibe.hashtags, true);
                        }
                        else {
                            merge = __spreadArray([], vibe.hashtags, true);
                        }
                        params = {
                            Itemid: vibe._id.toString(),
                            Labels: merge,
                            Comment: vibe.description ? vibe.description : "some comment",
                            Timestamp: vibe.createdAt,
                            Userid: userId.toString(),
                            Status: profileStatus,
                            AdminStatus: vibe.adminHidden ? "hidden" : "unhidden",
                        };
                        return [4 /*yield*/, axios_1.default
                                .post(this.feedUrl + "item", params, { headers: headers })
                                .then(function (d) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully added vibe in feed_admin_suspendIt in gorse feed");
                            })
                                .catch(function (err) {
                                var _a;
                                (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post vibe in feed_admin_suspendIt in gorse feed");
                            })];
                    case 3:
                        _b.sent();
                        params2 = [];
                        for (i = 0; i < likes.length; i++) {
                            param = {
                                UserId: likes[i].userId.toString(),
                                ItemId: likes[i].ref,
                                Feedbacktype: "like",
                                Timestamp: likes[i].createdAt,
                                Comment: "like feedback",
                            };
                            params2.push(param);
                        }
                        return [4 /*yield*/, axios_1.default
                                .post(this.feedUrl + "feedback", params2, {
                                headers: headers,
                            })
                                .then(function (d) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully added feedbacks in feed_admin_suspendIt in gorse feed");
                            })
                                .catch(function (err) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post feedbacks in feed_admin_suspendIt in gorse feed");
                            })];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info({ args: args }, "error: action param is neither delete nor reinstate in feed_admin_suspendIt");
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    GorseUtil.prototype.feed_admin_deactivateUser = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, vibes, user_result, p, i, promise;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = args.userId, vibes = args.vibes;
                        return [4 /*yield*/, axios_1.default
                                .delete(this.feedUrl + "user/".concat(userId))
                                .then(function (d) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully deleted user in feed_admin_deactivateUser in gorse feed");
                            })
                                .catch(function (err) {
                                var _a;
                                return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete user deleted user in feed_admin_deactivateUser in gorse feed");
                            })];
                    case 1:
                        user_result = _a.sent();
                        p = [];
                        for (i = 0; i < vibes.length; i++) {
                            promise = axios_1.default.delete(this.feedUrl + "item/".concat(vibes[i]._id.toString()));
                            p.push(promise);
                        }
                        Promise.all(p)
                            .then(function (d) {
                            var _a;
                            return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully deleted items (vibes) from gorse feed in feed_admin_deactivateUser");
                        })
                            .catch(function (err) {
                            var _a;
                            return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete items (vibes) from gorse feed in feed_admin_deactivateUser");
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return GorseUtil;
}());
exports.default = GorseUtil;
