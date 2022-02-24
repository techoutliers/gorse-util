import { URL } from "url";
import { Types } from "mongoose";
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
export type feed_deactivate_vibes = "_id";
export type feed_deactivate_likeIds = "ref" | "userId";
export type feed_deactivate_ownLikes = "ref" | "userId";
export type feed_set_account_status_user_vibes =
  | "vibeTags"
  | "hashtags"
  | "_id"
  | "description"
  | "createdAt"
  | "adminHidden";
export type feed_set_account_status_likes =
  | "_id"
  | "userId"
  | "ref"
  | "createdAt";

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

  async feed_deactivate(args: {
    userId: string;
    vibes: Record<feed_deactivate_vibes, string>[];
    likeIds: Record<feed_deactivate_likeIds, string>[];
    ownLikes: Record<feed_deactivate_ownLikes, string>[];
  }) {
    const { userId, vibes, likeIds, ownLikes } = args;
    this.logger?.info({ args }, "feed_deactivate");

    await axios.delete(this.feedUrl + `user/${userId}`).catch((err) => {
      this.logger?.error({ err: err }, `failed to delete user in gorse feed`);
    });
    let p1 = [];

    for (let i = 0; i < vibes.length; i++) {
      const promise = axios.delete(this.feedUrl + `item/${vibes[i]._id}`);
      p1.push(promise);
    }
    Promise.all(p1)
      .then((values) => {
        this.logger?.info(
          { values },
          "successfully deleted items from gorse feed"
        );
      })
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to delete items (feed) in gorse feed`
        );
      });
    let p2 = [];
    // Here feedbacks to user's own vibes are being deleted from gorse

    for (let j = 0; j < likeIds.length; j++) {
      const promise = axios.delete(
        this.feedUrl + `feedback/${likeIds[j].userId}/${likeIds[j].ref}`
      );
      p2.push(promise);
    }

    // Here feedbacks user has given to other vibes are being deleted from gorse

    for (let i = 0; i < ownLikes.length; i++) {
      const promise = axios.delete(
        this.feedUrl +
          `feedback/${ownLikes[i].userId.toString()}/${ownLikes[i].ref}`
      );
      p2.push(promise);
    }
    Promise.all(p2)
      .then((values) => {
        this.logger?.info(
          { values },
          "successfully deleted feedbacks from gorse feed"
        );
      })
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to delete feedbacks (feed) in gorse feed`
        );
      });
  }

  async feed_setAccountStatus(args: {
    userId: string;
    profileStatus: "public" | "private";
    userVibes: Record<feed_set_account_status_user_vibes, string>[];
    likes: Record<feed_set_account_status_likes, string>[];
  }) {
    const { userId, profileStatus, userVibes, likes } = args;
    const headers = { "Content-Type": "application/json" };

    const hold = [""];
    const user_params = {
      Userid: userId,
      Comment: "",
      Labels: hold,
      Subscribe: hold,
      Status: "public",
    };
    await axios
      .post(this.feedUrl + `user`, user_params, { headers: headers })
      .then((d) =>
        this.logger?.info(
          { data: d },
          "successfully added user in feed_setAccountStatus"
        )
      )
      .catch((e) =>
        this.logger?.error({ err: e }, `failed to post user in gorse feed`)
      );
    let params1 = [];
    for (let i = 0; i < userVibes.length; i++) {
      let merge = [];

      if (userVibes[i].vibeTags) {
        merge = [
          ...(userVibes[i].vibeTags as unknown as string[]),
          ...(userVibes[i].hashtags as unknown as string[]),
        ];
      } else {
        merge = [...(userVibes[i].hashtags as unknown as string[])];
      }
      const param = {
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
    await axios
      .post(this.feedUrl + `items`, params1, { headers: headers })
      .then((d) =>
        this.logger?.info(
          { data: d },
          "successfully added items in feed_setAccountStatus"
        )
      )
      .catch((err) => {
        this.logger?.error({ err: err }, `failed to post vibes in gorse feed`);
      });

    let params2 = [];

    for (let i = 0; i < likes.length; i++) {
      const param = {
        UserId: likes[i].userId.toString(),
        ItemId: likes[i].ref,
        Feedbacktype: "like",
        Timestamp: likes[i].createdAt,
        Comment: "like feedback",
      };
      params2.push(param);
    }
    await axios
      .post(this.feedUrl + `feedback`, params2, {
        headers: headers,
      })
      .then((d) =>
        this.logger?.info(
          { data: d },
          "successfully added feedbacks in feed_setAccountStatus"
        )
      )
      .catch((err) =>
        this.logger?.error(
          { err },
          "failed to post feedbacks in feed_setAccountStatus"
        )
      );
  }

  async feed_deleteUser(args: { userId: string; vibes: { _id: string }[] }) {
    const { userId, vibes } = args;
    const user_result = await axios
      .delete(this.feedUrl + `user/${userId}`)
      .then((d) =>
        this.logger?.info(
          { data: d },
          "successfully deleted user from gorse in feed_deleteUser"
        )
      )
      .catch((err) =>
        this.logger?.error(
          { err },
          "failed to delete user from gorse in feed_deleteUser"
        )
      );

    let p = [];
    for (let i = 0; i < vibes.length; i++) {
      const promise = axios.delete(
        this.feedUrl + `item/${vibes[i]._id.toString()}`
      );
      p.push(promise);
    }

    Promise.all(p)
      .then((d) =>
        this.logger?.info(
          { data: d },
          "successfully deleted items (vibes) from gorse in feed_deleteUser"
        )
      )
      .catch((err) =>
        this.logger?.error(
          { err },
          "failed to delete items (vibes) from gorse in feed_deleteUser"
        )
      );
  }

  async feed_recordScreenshot(args: {
    userId: string;
    vibes: { _id: string }[];
  }) {
    const { userId, vibes } = args;
    this.logger?.info({ args }, "feed_recordScreenshot");

    await axios
      .delete(this.feedUrl + `user/${userId}`)
      .then((d) =>
        this.logger?.info(
          { data: d },
          "successfully deleted user from gorse in feed_recordScreenshot"
        )
      )
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to delete user in feed_recordScreenshot in gorse feed`
        );
      });

    let p1 = [];

    for (let i = 0; i < vibes.length; i++) {
      const promise = axios.delete(this.feedUrl + `item/${vibes[i]._id}`);
      p1.push(promise);
    }
    Promise.all(p1)
      .then((values) => {
        this.logger?.info(
          { values },
          "successfully deleted items in feed_recordScreenshot from gorse feed"
        );
      })
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to delete items (feed) in feed_recordScreenshot in gorse feed`
        );
      });
  }
  async feed_admin_activate(args: {
    userId: string;
    userVibes: Record<feed_set_account_status_user_vibes, string>[];
    allLikes: Record<feed_set_account_status_likes, string>[];
    profileStatus: string;
  }) {
    const { userId, userVibes, allLikes, profileStatus } = args;
    const headers = { "Content-Type": "application/json" };

    const hold = [""];
    const user_params = {
      Userid: userId,
      Comment: "",
      Labels: hold,
      Subscribe: hold,
      Status: profileStatus || "public",
    };
    await axios
      .post(this.feedUrl + `user`, user_params, { headers: headers })
      .then((d) =>
        this.logger?.info(
          { data: d },
          "successfully added user in feed_admin_activate"
        )
      )
      .catch((e) =>
        this.logger?.error(
          { err: e },
          `failed to post user in feed_admin_activate in gorse feed`
        )
      );

    let params1 = [];
    for (let i = 0; i < userVibes.length; i++) {
      let merge = [];

      if (userVibes[i].vibeTags) {
        merge = [
          ...(userVibes[i].vibeTags as unknown as string[]),
          ...(userVibes[i].hashtags as unknown as string[]),
        ];
      } else {
        merge = [...(userVibes[i].hashtags as unknown as string[])];
      }
      const param = {
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
    await axios
      .post(this.feedUrl + `items`, params1, { headers: headers })
      .then((d) =>
        this.logger?.info(
          { data: d },
          "successfully added items in feed_admin_activate in gorse feed"
        )
      )
      .catch((err) => {
        this.logger?.error({ err: err }, `failed to post vibes in gorse feed`);
      });

    let params2 = [];

    for (let i = 0; i < allLikes.length; i++) {
      const param = {
        UserId: allLikes[i].userId.toString(),
        ItemId: allLikes[i].ref,
        Feedbacktype: "like",
        Timestamp: allLikes[i].createdAt,
        Comment: "like feedback",
      };
      params2.push(param);
    }
    await axios
      .post(this.feedUrl + `feedback`, params2, {
        headers: headers,
      })
      .then((d) =>
        this.logger?.info(
          { data: d },
          "successfully added feedbacks in feed_admin_activate in gorse feed"
        )
      )
      .catch((err) =>
        this.logger?.error(
          { err },
          "failed to post feedbacks in feed_admin_activate in gorse feed"
        )
      );
  }

  async feed_admin_hideVibeAsAdmin(args: {
    vibeId: string;
    adminStatus: "hidden" | "unhidden";
  }) {
    const { vibeId, adminStatus } = args;

    const headers = { "Content-Type": "application/json" };
    const item = [
      {
        itemid: vibeId,
        adminstatus: adminStatus,
        status: "",
      },
    ];

    const result = await axios
      .patch(this.feedUrl + `item`, item, {
        headers: headers,
      })
      .then((d) =>
        this.logger?.info(
          { data: d },
          "successfully updated vibe status in feed_admin_hideVibeAsAdmin in gorse feed"
        )
      )
      .catch((err) =>
        this.logger?.error(
          { err },
          "failed to updated vibe status in feed_admin_hideVibeAsAdmin in gorse feed"
        )
      );
  }

  async feed_admin_deleteVibeAsAdmin(args: { vibeId: string }) {
    const { vibeId } = args;

    const result = await axios
      .delete(this.feedUrl + `item/${vibeId}`)
      .then((d) =>
        this.logger?.info(
          { data: d },
          "successfully deleted vibe (item) in feed_admin_deleteVibeAsAdmin in gorse feed"
        )
      )
      .catch((err) =>
        this.logger?.error(
          { err },
          "failed to delete vibe (item) in feed_admin_deleteVibeAsAdmin in gorse feed"
        )
      );
  }

  async feed_admin_suspendIt(args: {
    userId: string;
    vibe: {
      hashtags: string[];
      vibeTags: string[];
      description: string;
      createdAt: string;
      adminHidden: "hidden" | "unhidden";
      _id: string;
    };
    likes: Record<feed_set_account_status_likes, string>[];
    vibeId: string;
    action: "delete" | "reinstate";
    profileStatus: "private" | "public";
  }) {
    const { vibeId, action } = args;
    const headers = {
      "Content-Type": "application/json",
    };
    if (action === "delete") {
      const result = await axios
        .delete(this.feedUrl + `item/${vibeId}`)
        .then((d) =>
          this.logger?.info(
            { data: d },
            "successfully deleted vibe (item) in feed_admin_deleteVibeAsAdmin in gorse feed"
          )
        )
        .catch((err) =>
          this.logger?.error(
            { err },
            "failed to delete vibe (item) in feed_admin_deleteVibeAsAdmin in gorse feed"
          )
        );
    } else if (action === "reinstate") {
      const { vibe, likes, profileStatus, userId } = args;
      let merge = [];
      if (vibe.vibeTags) {
        merge = [...vibe.vibeTags, ...vibe.hashtags];
      } else {
        merge = [...vibe.hashtags];
      }

      const params = {
        Itemid: vibe._id.toString(),
        Labels: merge,
        Comment: vibe.description ? vibe.description : "some comment",
        Timestamp: vibe.createdAt,
        Userid: userId.toString(),
        Status: profileStatus,
        AdminStatus: vibe.adminHidden ? "hidden" : "unhidden",
      };

      await axios
        .post(this.feedUrl + `item`, params, { headers: headers })
        .then((d) =>
          this.logger?.info(
            { data: d },
            "successfully added vibe in feed_admin_suspendIt in gorse feed"
          )
        )
        .catch((err) => {
          this.logger?.error(
            { err: err },
            `failed to post vibe in feed_admin_suspendIt in gorse feed`
          );
        });

      let params2 = [];

      for (let i = 0; i < likes.length; i++) {
        const param = {
          UserId: likes[i].userId.toString(),
          ItemId: likes[i].ref,
          Feedbacktype: "like",
          Timestamp: likes[i].createdAt,
          Comment: "like feedback",
        };
        params2.push(param);
      }
      await axios
        .post(this.feedUrl + `feedback`, params2, {
          headers: headers,
        })
        .then((d) =>
          this.logger?.info(
            { data: d },
            "successfully added feedbacks in feed_admin_suspendIt in gorse feed"
          )
        )
        .catch((err) =>
          this.logger?.error(
            { err },
            "failed to post feedbacks in feed_admin_suspendIt in gorse feed"
          )
        );
    } else {
      this.logger?.info(
        { args },
        "error: action param is neither delete nor reinstate in feed_admin_suspendIt"
      );
    }
  }
  async feed_admin_deactivateUser(args: {
    userId: string;
    vibes: { _id: string }[];
  }) {
    const { userId, vibes } = args;
    const user_result = await axios
      .delete(this.feedUrl + `user/${userId}`)
      .then((d) =>
        this.logger?.info(
          { data: d },
          "successfully deleted user in feed_admin_deactivateUser in gorse feed"
        )
      )
      .catch((err) =>
        this.logger?.error(
          { err },
          "failed to delete user deleted user in feed_admin_deactivateUser in gorse feed"
        )
      );

    let p = [];
    for (let i = 0; i < vibes.length; i++) {
      const promise = axios.delete(
        this.feedUrl + `item/${vibes[i]._id.toString()}`
      );
      p.push(promise);
    }

    Promise.all(p)
      .then((d) =>
        this.logger?.info(
          { data: d },
          "successfully deleted items (vibes) from gorse feed in feed_admin_deactivateUser"
        )
      )
      .catch((err) =>
        this.logger?.error(
          { err },
          "failed to delete items (vibes) from gorse feed in feed_admin_deactivateUser"
        )
      );
  }
}
export default GorseUtil;
