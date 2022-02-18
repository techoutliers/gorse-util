import { URL } from "url";
import axios from "axios";
export interface ILogger {
  debug(...n: any): void;
  info(...n: any): void;
  error(...n: any): void;
}

export type Init = {
  feedUrl: string;
  directoryUrl: string;
  logger?: ILogger;
};

class GorseUtil {
  feedUrl: string | null = null;
  directoryUrl: string | null = null;
  logger?: ILogger = undefined;
  constructor() {}
  init(args: Init) {
    this.feedUrl = args.feedUrl;
    this.directoryUrl = args.directoryUrl;
    this.logger = args.logger;
  }

  async feed_deleteAVibe(args: { vibeId: string; likedByUserIds: string[] }) {
    this.logger?.info({ args }, "feed_deleteAVibe");
    const { vibeId, likedByUserIds } = args;

    await axios.delete(this.feedUrl + `item/${vibeId}`).catch((e) => {
      this.logger?.error({ err: e }, "failed to delete vibe from gorse feed");
    });

    for (let i = 0; i < likedByUserIds.length; i++) {
      const result = await axios
        .delete(this.feedUrl + `feedback/${likedByUserIds[i]}/${vibeId}`)
        .catch((e) => {
          this.logger?.error(
            { err: e },
            "failed to delete vibe feedback from gorse feed"
          );
        });
    }
  }
  async feed_toggleSecretUser(args: {
    vibes: Record<string, string>[];
    status: "private" | "public";
  }) {
    this.logger?.info({ args }, "feed_toggleSecretUser");

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
    const result = await axios
      .patch(this.feedUrl + `item`, items, {
        headers: headers,
      })
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to patch vibe status to ${status} in gorse feed`
        );
      });
  }
}
export default GorseUtil;
