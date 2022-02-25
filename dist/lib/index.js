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
            var vibeId, likedByUserIds, i;
            var _this = this;
            return __generator(this, function (_b) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info({ args: args }, "feed_deleteAVibe");
                vibeId = args.vibeId, likedByUserIds = args.likedByUserIds;
                axios_1.default.delete(this.feedUrl + "item/".concat(vibeId)).catch(function (e) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: e }, "failed to delete vibe from gorse feed");
                });
                for (i = 0; i < likedByUserIds.length; i++) {
                    axios_1.default
                        .delete(this.feedUrl + "feedback/".concat(likedByUserIds[i], "/").concat(vibeId))
                        .then(function (d) {
                        var _a;
                        return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully deleted a vibe in feed_deleteAVibe in gorse feed ");
                    })
                        .catch(function (e) {
                        var _a;
                        (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: e }, "failed to delete vibe feedback from gorse feed");
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_toggleSecretUser = function (args) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var vibes, status, items, i, item, headers;
            var _this = this;
            return __generator(this, function (_b) {
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
                axios_1.default
                    .patch(this.feedUrl + "item", items, {
                    headers: headers,
                })
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully patched a vibe to ".concat(status, " in feed_toggleSecretUser in gorse feed"));
                })
                    .catch(function (err) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to patch vibe status to ".concat(status, " in feed_toggleSecretUser in gorse feed"));
                });
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_deactivate = function (args) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var userId, vibes, likeIds, ownLikes, p1, i, promise, p2, j, promise, i, promise;
            var _this = this;
            return __generator(this, function (_b) {
                userId = args.userId, vibes = args.vibes, likeIds = args.likeIds, ownLikes = args.ownLikes;
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info({ args: args }, "feed_deactivate");
                axios_1.default
                    .delete(this.feedUrl + "user/".concat(userId))
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully deleted a user in feed_deactivate in gorse feed ");
                })
                    .catch(function (err) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete user in feed_deactivate in gorse feed");
                });
                p1 = [];
                for (i = 0; i < vibes.length; i++) {
                    promise = axios_1.default.delete(this.feedUrl + "item/".concat(vibes[i]._id));
                    p1.push(promise);
                }
                Promise.all(p1)
                    .then(function (d) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully deleted items with promise in feed_deactivate in gorse feed");
                })
                    .catch(function (err) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete items with promise in feed_deactivate in gorse feed");
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
                    .then(function (d) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully deleted feedbacks with promise in feed_deactivate in gorse feed");
                })
                    .catch(function (err) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete feedbacks with promise in feed_deactivate in gorse feed");
                });
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_setAccountStatus = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, profileStatus, userVibes, likes, headers, hold, user_params, params1, i, merge, param, params2, i, param;
            var _this = this;
            return __generator(this, function (_a) {
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
                axios_1.default
                    .post(this.feedUrl + "user", user_params, { headers: headers })
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully posted a user in feed_setAccountStatus in gorse feed");
                })
                    .catch(function (e) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: e }, "failed to post a user in feed_setAccountStatus in gorse feed");
                });
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
                axios_1.default
                    .post(this.feedUrl + "items", params1, { headers: headers })
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully posted items with promise in feed_setAccountStatus in gorse feed");
                })
                    .catch(function (err) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post vibes with promise in feed_setAccountStatus in gorse feed");
                });
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
                axios_1.default
                    .post(this.feedUrl + "feedback", params2, {
                    headers: headers,
                })
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully added feedbacks in feed_setAccountStatus in gorse feed");
                })
                    .catch(function (err) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post feedbacks in feed_setAccountStatus in gorse feed");
                });
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_deleteUser = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, vibes, p, i, promise;
            var _this = this;
            return __generator(this, function (_a) {
                userId = args.userId, vibes = args.vibes;
                axios_1.default
                    .delete(this.feedUrl + "user/".concat(userId))
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully deleted a user in feed_deleteUser in gorse feed ");
                })
                    .catch(function (err) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete user from gorse in feed_deleteUser in gorse feed");
                });
                p = [];
                for (i = 0; i < vibes.length; i++) {
                    promise = axios_1.default.delete(this.feedUrl + "item/".concat(vibes[i]._id.toString()));
                    p.push(promise);
                }
                Promise.all(p)
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ data: d }, "successfully deleted items (vibes) with promise in feed_deleteUser in gorse feed");
                })
                    .catch(function (err) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete items (vibes) in feed_deleteUser in gorse feed");
                });
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_recordScreenshot = function (args) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var userId, vibes, p1, i, promise;
            var _this = this;
            return __generator(this, function (_b) {
                userId = args.userId, vibes = args.vibes;
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info({ args: args }, "feed_recordScreenshot");
                axios_1.default
                    .delete(this.feedUrl + "user/".concat(userId))
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully deleted a user in feed_recordScreenshot in gorse feed ");
                })
                    .catch(function (err) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete user in feed_recordScreenshot in gorse feed");
                });
                p1 = [];
                for (i = 0; i < vibes.length; i++) {
                    promise = axios_1.default.delete(this.feedUrl + "item/".concat(vibes[i]._id));
                    p1.push(promise);
                }
                Promise.all(p1)
                    .then(function (d) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully deleted items with promise in feed_recordScreenshot in gorse feed");
                })
                    .catch(function (err) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete items (feed) with promise in feed_recordScreenshot in gorse feed");
                });
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_admin_activate = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, userVibes, allLikes, profileStatus, headers, hold, user_params, params1, i, merge, param, params2, i, param;
            var _this = this;
            return __generator(this, function (_a) {
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
                axios_1.default
                    .post(this.feedUrl + "user", user_params, { headers: headers })
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully deleted a user in feed_admin_activate in gorse feed ");
                })
                    .catch(function (e) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: e }, "failed to post user in feed_admin_activate in gorse feed");
                });
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
                axios_1.default
                    .post(this.feedUrl + "items", params1, { headers: headers })
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully posted vibes in feed_admin_activate in gorse feed ");
                })
                    .catch(function (err) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post vibes in feed_admin_activate in gorse feed");
                });
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
                axios_1.default
                    .post(this.feedUrl + "feedback", params2, {
                    headers: headers,
                })
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully posted feedbacks in feed_admin_activate in gorse feed ");
                })
                    .catch(function (err) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post feedbacks in feed_admin_activate in gorse feed");
                });
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_admin_hideVibeAsAdmin = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var vibeId, adminStatus, headers, item;
            var _this = this;
            return __generator(this, function (_a) {
                vibeId = args.vibeId, adminStatus = args.adminStatus;
                headers = { "Content-Type": "application/json" };
                item = [
                    {
                        itemid: vibeId,
                        adminstatus: adminStatus,
                        status: "",
                    },
                ];
                axios_1.default
                    .patch(this.feedUrl + "item", item, {
                    headers: headers,
                })
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully updated vibe status in feed_admin_hideVibeAsAdmin in gorse feed");
                })
                    .catch(function (err) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to updated vibe status in feed_admin_hideVibeAsAdmin in gorse feed");
                });
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_admin_deleteVibeAsAdmin = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var vibeId;
            var _this = this;
            return __generator(this, function (_a) {
                vibeId = args.vibeId;
                axios_1.default
                    .delete(this.feedUrl + "item/".concat(vibeId))
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully deleted vibe (item) in feed_admin_deleteVibeAsAdmin in gorse feed");
                })
                    .catch(function (err) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete vibe (item) in feed_admin_deleteVibeAsAdmin in gorse feed");
                });
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_admin_suspendIt = function (args) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var vibeId, action, headers, vibe, likes, profileStatus, userId, merge, params, params2, i, param;
            var _this = this;
            return __generator(this, function (_b) {
                vibeId = args.vibeId, action = args.action;
                headers = {
                    "Content-Type": "application/json",
                };
                if (action === "delete") {
                    axios_1.default
                        .delete(this.feedUrl + "item/".concat(vibeId))
                        .then(function (d) {
                        var _a;
                        return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully deleted vibe (item) in feed_admin_deleteVibeAsAdmin in gorse feed");
                    })
                        .catch(function (err) {
                        var _a;
                        return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete vibe (item) in feed_admin_deleteVibeAsAdmin in gorse feed");
                    });
                }
                else if (action === "reinstate") {
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
                    axios_1.default
                        .post(this.feedUrl + "item", params, { headers: headers })
                        .then(function (d) {
                        var _a;
                        return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully added vibe in feed_admin_suspendIt in gorse feed");
                    })
                        .catch(function (err) {
                        var _a;
                        (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post vibe in feed_admin_suspendIt in gorse feed");
                    });
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
                    axios_1.default
                        .post(this.feedUrl + "feedback", params2, {
                        headers: headers,
                    })
                        .then(function (d) {
                        var _a;
                        return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully added feedbacks in feed_admin_suspendIt in gorse feed");
                    })
                        .catch(function (err) {
                        var _a;
                        return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post feedbacks in feed_admin_suspendIt in gorse feed");
                    });
                }
                else {
                    (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info({ args: args }, "error: action param is neither delete nor reinstate in feed_admin_suspendIt");
                }
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_admin_deactivateUser = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, vibes, p, i, promise;
            var _this = this;
            return __generator(this, function (_a) {
                userId = args.userId, vibes = args.vibes;
                axios_1.default
                    .delete(this.feedUrl + "user/".concat(userId))
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully deleted user in feed_admin_deactivateUser in gorse feed");
                })
                    .catch(function (err) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete user deleted user in feed_admin_deactivateUser in gorse feed");
                });
                p = [];
                for (i = 0; i < vibes.length; i++) {
                    promise = axios_1.default.delete(this.feedUrl + "item/".concat(vibes[i]._id.toString()));
                    p.push(promise);
                }
                Promise.all(p)
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully deleted items (vibes) from gorse feed in feed_admin_deactivateUser");
                })
                    .catch(function (err) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete items (vibes) from gorse feed in feed_admin_deactivateUser");
                });
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_admin_deleteUser = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, vibes, p, i, promise;
            var _this = this;
            return __generator(this, function (_a) {
                userId = args.userId, vibes = args.vibes;
                axios_1.default
                    .delete(this.feedUrl + "user/".concat(userId))
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully deleted user in feed_admin_deleteUser in gorse feed");
                })
                    .catch(function (err) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete user deleted user in feed_admin_deleteUser in gorse feed");
                });
                p = [];
                for (i = 0; i < vibes.length; i++) {
                    promise = axios_1.default.delete(this.feedUrl + "item/".concat(vibes[i]._id.toString()));
                    p.push(promise);
                }
                Promise.all(p)
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully deleted items (vibes) from gorse feed in feed_admin_deleteUser");
                })
                    .catch(function (err) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to delete items (vibes) from gorse feed in feed_admin_deleteUser");
                });
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_admin_confirmUser_insertUser = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, profileStatus, headers, hold, user_params;
            var _this = this;
            return __generator(this, function (_a) {
                userId = args.userId, profileStatus = args.profileStatus;
                headers = { "Content-Type": "application/json" };
                hold = [""];
                user_params = {
                    Userid: userId,
                    Comment: "",
                    Labels: hold,
                    Subscribe: hold,
                    Status: profileStatus || "public",
                };
                axios_1.default
                    .post(this.feedUrl + "user", user_params, { headers: headers })
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully added user in feed_admin_confirmUser_insertUser in gorse feed");
                })
                    .catch(function (e) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: e }, "failed to post user in feed_admin_confirmUser_insertUser in gorse feed");
                });
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_admin_confirmUser_postProfPics = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, profileStatus, userVibes, headers, params1, i, merge, param;
            var _this = this;
            return __generator(this, function (_a) {
                userId = args.userId, profileStatus = args.profileStatus, userVibes = args.userVibes;
                headers = { "Content-Type": "application/json" };
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
                axios_1.default
                    .post(this.feedUrl + "items", params1, { headers: headers })
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully added items in feed_admin_confirmUser_postProfPics in gorse feed");
                })
                    .catch(function (err) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post vibes in feed_admin_confirmUser_postProfPics in gorse feed");
                });
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_admin_confirmUserAll_postProfPics = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, profileStatus, userVibes, headers, params1, i, merge, param;
            var _this = this;
            return __generator(this, function (_a) {
                userId = args.userId, profileStatus = args.profileStatus, userVibes = args.userVibes;
                headers = { "Content-Type": "application/json" };
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
                axios_1.default
                    .post(this.feedUrl + "items", params1, { headers: headers })
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully added items in feed_admin_confirmUserAll_postProfPics in gorse feed");
                })
                    .catch(function (err) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post vibes in feed_admin_confirmUserAll_postProfPics in gorse feed");
                });
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_likeVibe = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, vibeId, headers, params;
            var _this = this;
            return __generator(this, function (_a) {
                userId = args.userId, vibeId = args.vibeId;
                headers = { "Content-Type": "application/json" };
                params = [
                    {
                        feedbacktype: "like",
                        userid: userId,
                        itemid: vibeId,
                        timestamp: new Date().toISOString(),
                        comment: "some comment",
                    },
                ];
                axios_1.default
                    .post(this.feedUrl + "feedback", params, {
                    headers: headers,
                })
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully added like feedback in feed_likeVibe in gorse feed");
                })
                    .catch(function (err) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post like feedback in feed_likeVibe in gorse feed");
                });
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_postClick = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, itemId, headers, params;
            var _this = this;
            return __generator(this, function (_a) {
                userId = args.userId, itemId = args.itemId;
                headers = { "Content-Type": "application/json" };
                params = [
                    {
                        feedbacktype: "click",
                        userid: userId,
                        itemid: itemId,
                        timestamp: new Date().toISOString(),
                        comment: "some comment",
                    },
                ];
                axios_1.default
                    .post(this.feedUrl + "feedback", params, { headers: headers })
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully added click feedback in feed_postClick in gorse feed");
                })
                    .catch(function (err) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post click feedback in feed_postClick in gorse feed");
                });
                return [2 /*return*/];
            });
        });
    };
    GorseUtil.prototype.feed_postRead = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, itemId, headers, params;
            var _this = this;
            return __generator(this, function (_a) {
                userId = args.userId, itemId = args.itemId;
                headers = { "Content-Type": "application/json" };
                params = [
                    {
                        userid: userId,
                        itemid: itemId,
                        feedbacktype: "read",
                        timestamp: new Date().toISOString(),
                        comment: "read feedback",
                    },
                ];
                axios_1.default
                    .post(this.feedUrl + "feedback", params, {
                    headers: headers,
                })
                    .then(function (d) {
                    var _a;
                    return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.info({ d: d, args: args }, "successfully added read feedback in feed_postRead in gorse feed");
                })
                    .catch(function (err) {
                    var _a;
                    (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, "failed to post read feedback in feed_postRead in gorse feed");
                });
                return [2 /*return*/];
            });
        });
    };
    return GorseUtil;
}());
exports.default = GorseUtil;
