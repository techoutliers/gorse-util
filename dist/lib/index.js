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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class GorseUtil {
    constructor() {
        this.feedUrl = null;
        this.directoryUrl = null;
        this.logger = undefined;
    }
    init(args) {
        this.feedUrl = args.feedUrl;
        this.directoryUrl = args.directoryUrl;
        this.logger = args.logger;
    }
    feed_deleteAVibe(args) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info({ args }, "feed_deleteAVibe");
            const { vibeId, likedByUserIds } = args;
            yield axios_1.default.delete(this.feedUrl + `item/${vibeId}`).catch((e) => {
                var _a;
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: e }, "failed to delete vibe from gorse feed");
            });
            for (let i = 0; i < likedByUserIds.length; i++) {
                const result = yield axios_1.default
                    .delete(this.feedUrl + `feedback/${likedByUserIds[i]}/${vibeId}`)
                    .catch((e) => {
                    var _a;
                    (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: e }, "failed to delete vibe feedback from gorse feed");
                });
            }
        });
    }
    feed_toggleSecretUser(args) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.info({ args }, "feed_toggleSecretUser");
            const { vibes, status } = args;
            const items = [];
            for (let i = 0; i < vibes.length; i++) {
                const item = {
                    itemid: vibes[i]._id,
                    status: status,
                    adminstatus: "",
                };
                items.push(item);
            }
            const headers = { "Content-Type": "application/json" };
            const result = yield axios_1.default
                .patch(this.feedUrl + `item`, items, {
                headers: headers,
            })
                .catch((err) => {
                var _a;
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.error({ err: err }, `failed to patch vibe status to ${status} in gorse feed`);
            });
        });
    }
}
exports.default = GorseUtil;
