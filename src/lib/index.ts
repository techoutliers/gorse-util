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

    axios
      .delete(this.feedUrl + `item/${vibeId}`)
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully to delete vibe in feed_deleteAVibe in gorse feed "
        )
      )
      .catch((e) => {
        this.logger?.error(
          { err: e },
          "failed to delete vibe in feed_deleteAVibe in gorse feed"
        );
      });

    for (let i = 0; i < likedByUserIds.length; i++) {
      axios
        .delete(this.feedUrl + `feedback/${likedByUserIds[i]}/${vibeId}`)
        .then((d: any) =>
          this.logger?.info(
            { data: d?.data, args },
            "successfully deleted a vibe in feed_deleteAVibe in gorse feed "
          )
        )
        .catch((e) => {
          this.logger?.error(
            { err: e },
            "failed to delete vibe feedback in feed_deleteAVibe in gorse feed"
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
    axios
      .patch(this.feedUrl + `item`, items, {
        headers: headers,
      })
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          `successfully patched a vibe to ${status} in feed_toggleSecretUser in gorse feed`
        )
      )
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to patch vibe status to ${status} in feed_toggleSecretUser in gorse feed`
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

    axios
      .delete(this.feedUrl + `user/${userId}`)
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully deleted a user in feed_deactivate in gorse feed "
        )
      )
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to delete user in feed_deactivate in gorse feed`
        );
      });
    let p1 = [];

    for (let i = 0; i < vibes.length; i++) {
      const promise = axios.delete(this.feedUrl + `item/${vibes[i]._id}`);
      p1.push(promise);
    }
    Promise.all(p1)
      .then((d: any) => {
        this.logger?.info(
          { data: d?.data, args },
          "successfully deleted items with promise in feed_deactivate in gorse feed"
        );
      })
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to delete items with promise in feed_deactivate in gorse feed`
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
      .then((d: any) => {
        this.logger?.info(
          { data: d?.data, args },
          "successfully deleted feedbacks with promise in feed_deactivate in gorse feed"
        );
      })
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to delete feedbacks with promise in feed_deactivate in gorse feed`
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
    axios
      .post(this.feedUrl + `user`, user_params, { headers: headers })
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully posted a user in feed_setAccountStatus in gorse feed"
        )
      )
      .catch((e) =>
        this.logger?.error(
          { err: e },
          `failed to post a user in feed_setAccountStatus in gorse feed`
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
    axios
      .post(this.feedUrl + `items`, params1, { headers: headers })
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully posted items with promise in feed_setAccountStatus in gorse feed"
        )
      )
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to post vibes with promise in feed_setAccountStatus in gorse feed`
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
    axios
      .post(this.feedUrl + `feedback`, params2, {
        headers: headers,
      })
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully added feedbacks in feed_setAccountStatus in gorse feed"
        )
      )
      .catch((err) =>
        this.logger?.error(
          { err },
          "failed to post feedbacks in feed_setAccountStatus in gorse feed"
        )
      );
  }

  async feed_deleteUser(args: { userId: string; vibes: { _id: string }[] }) {
    const { userId, vibes } = args;
    axios
      .delete(this.feedUrl + `user/${userId}`)
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully deleted a user in feed_deleteUser in gorse feed "
        )
      )
      .catch((err) =>
        this.logger?.error(
          { err },
          "failed to delete user from gorse in feed_deleteUser in gorse feed"
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
          { data: d.map((i) => i?.data) },
          "successfully deleted items (vibes) with promise in feed_deleteUser in gorse feed"
        )
      )
      .catch((err) =>
        this.logger?.error(
          { err },
          "failed to delete items (vibes) in feed_deleteUser in gorse feed"
        )
      );
  }

  async feed_recordScreenshot(args: {
    userId: string;
    vibes: { _id: string }[];
  }) {
    const { userId, vibes } = args;
    this.logger?.info({ args }, "feed_recordScreenshot");

    axios
      .delete(this.feedUrl + `user/${userId}`)
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully deleted a user in feed_recordScreenshot in gorse feed "
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
      .then((d: any) => {
        this.logger?.info(
          { data: d.map((i: any) => i?.data), args },
          "successfully deleted items with promise in feed_recordScreenshot in gorse feed"
        );
      })
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to delete items (feed) with promise in feed_recordScreenshot in gorse feed`
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
    axios
      .post(this.feedUrl + `user`, user_params, { headers: headers })
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully deleted a user in feed_admin_activate in gorse feed "
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
    axios
      .post(this.feedUrl + `items`, params1, { headers: headers })
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully posted vibes in feed_admin_activate in gorse feed "
        )
      )
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to post vibes in feed_admin_activate in gorse feed`
        );
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
    axios
      .post(this.feedUrl + `feedback`, params2, {
        headers: headers,
      })
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully posted feedbacks in feed_admin_activate in gorse feed "
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
      },
    ];

    axios
      .patch(this.feedUrl + `item`, item, {
        headers: headers,
      })
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
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

    axios
      .delete(this.feedUrl + `item/${vibeId}`)
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
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
      axios
        .delete(this.feedUrl + `item/${vibeId}`)
        .then((d: any) =>
          this.logger?.info(
            { data: d?.data, args },
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

      axios
        .post(this.feedUrl + `item`, params, { headers: headers })
        .then((d: any) =>
          this.logger?.info(
            { data: d?.data, args },
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
      axios
        .post(this.feedUrl + `feedback`, params2, {
          headers: headers,
        })
        .then((d: any) =>
          this.logger?.info(
            { data: d?.data, args },
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
    axios
      .delete(this.feedUrl + `user/${userId}`)
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
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
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
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
  async feed_admin_deleteUser(args: {
    userId: string;
    vibes: { _id: string }[];
  }) {
    const { userId, vibes } = args;
    axios
      .delete(this.feedUrl + `user/${userId}`)
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully deleted user in feed_admin_deleteUser in gorse feed"
        )
      )
      .catch((err) =>
        this.logger?.error(
          { err },
          "failed to delete user deleted user in feed_admin_deleteUser in gorse feed"
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
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully deleted items (vibes) from gorse feed in feed_admin_deleteUser"
        )
      )
      .catch((err) =>
        this.logger?.error(
          { err },
          "failed to delete items (vibes) from gorse feed in feed_admin_deleteUser"
        )
      );
  }
  async feed_admin_confirmUser_insertUser(args: {
    userId: string;
    profileStatus: string;
  }) {
    const { userId, profileStatus } = args;
    this.logger?.info({ args }, "feed_admin_confirmUser_insertUser");

    const headers = { "Content-Type": "application/json" };

    const hold = [""];
    const user_params = {
      Userid: userId,
      Comment: "",
      Labels: hold,
      Subscribe: hold,
      Status: profileStatus || "public",
    };
    axios
      .post(this.feedUrl + `user`, user_params, { headers: headers })
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully added user in feed_admin_confirmUser_insertUser in gorse feed"
        )
      )
      .catch((e) =>
        this.logger?.error(
          { err: e },
          `failed to post user in feed_admin_confirmUser_insertUser in gorse feed`
        )
      );
  }
  async feed_admin_confirmUser_postProfPics(args: {
    userId: string;
    userVibes: Record<feed_set_account_status_user_vibes, string>[];
    profileStatus: string;
  }) {
    const { userId, profileStatus, userVibes } = args;
    this.logger?.info({ args }, "feed_admin_confirmUser_postProfPics");

    const headers = { "Content-Type": "application/json" };

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
    axios
      .post(this.feedUrl + `items`, params1, { headers: headers })
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully added items in feed_admin_confirmUser_postProfPics in gorse feed"
        )
      )
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to post vibes in feed_admin_confirmUser_postProfPics in gorse feed`
        );
      });
  }
  async feed_admin_confirmUserAll_postProfPics(args: {
    userId: string;
    userVibes: Record<feed_set_account_status_user_vibes, string>[];
    profileStatus: string;
  }) {
    this.logger?.info({ args }, "feed_admin_confirmUserAll_postProfPics");
    const { userId, profileStatus, userVibes } = args;
    await this.feed_admin_confirmUser_insertUser({ userId, profileStatus });
    const headers = { "Content-Type": "application/json" };

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
    axios
      .post(this.feedUrl + `items`, params1, { headers: headers })
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully added items in feed_admin_confirmUserAll_postProfPics in gorse feed"
        )
      )
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to post vibes in feed_admin_confirmUserAll_postProfPics in gorse feed`
        );
      });
  }
  async feed_likeVibe(args: { userId: string; vibeId: string }) {
    const { userId, vibeId } = args;

    const headers = { "Content-Type": "application/json" };
    const params = [
      {
        feedbacktype: "like",
        userid: userId,
        itemid: vibeId,
        timestamp: new Date().toISOString(),
        comment: "some comment",
      },
    ];

    axios
      .post(this.feedUrl + `feedback`, params, {
        headers: headers,
      })
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully added like feedback in feed_likeVibe in gorse feed"
        )
      )
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to post like feedback in feed_likeVibe in gorse feed`
        );
      });
  }
  async feed_postClick(args: { userId: string; itemId: string }) {
    const { userId, itemId } = args;
    const headers = { "Content-Type": "application/json" };
    const params = [
      {
        feedbacktype: "click",
        userid: userId,
        itemid: itemId,
        timestamp: new Date().toISOString(),
        comment: "some comment",
      },
    ];

    axios
      .post(this.feedUrl + `feedback`, params, { headers: headers })

      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully added click feedback in feed_postClick in gorse feed"
        )
      )
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to post click feedback in feed_postClick in gorse feed`
        );
      });
  }
  async feed_postRead(args: { userId: string; itemId: string }) {
    const { userId, itemId } = args;

    const headers = { "Content-Type": "application/json" };
    const params = [
      {
        userid: userId,
        itemid: itemId,
        feedbacktype: "read",
        timestamp: new Date().toISOString(),
        comment: "read feedback",
      },
    ];

    axios
      .post(this.feedUrl + `feedback`, params, {
        headers: headers,
      })
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully added read feedback in feed_postRead in gorse feed"
        )
      )
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to post read feedback in feed_postRead in gorse feed`
        );
      });
  }
  async feed_postVibe(args: {
    userId: string;
    vibe: {
      vibeTags: string[];
      hashtags: string[];
      _id: string;
      description: string;
      createdAt: Date;
      adminHidden: boolean;
    };
    profileStatus: "public" | "private";
  }) {
    const { userId, profileStatus, vibe } = args;

    // inserting the newly created vibe to gorse
    const headers = {
      "Content-Type": "application/json",
    };
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
      Status: profileStatus === "private" ? "private" : "public",
      AdminStatus: vibe.adminHidden ? "hidden" : "unhidden",
    };
    let arr = [];
    arr.push(params);
    axios
      .post(process.env.GORSE_VIBE_API + `items`, arr, { headers: headers })
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully posted vibe in feed_postVibe in gorse feed"
        )
      )
      .catch((err) => {
        this.logger?.error(
          { err: err },
          `failed to post vibe in feed_postVibe in gorse feed`
        );
      });
  }

  async feed_admin_rejectUser(args: {
    userId: string;
    vibes: { _id: string }[];
  }) {
    const { userId, vibes } = args;
    axios
      .delete(this.feedUrl + `user/${userId}`)
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully deleted user in feed_admin_rejectUser in gorse feed"
        )
      )
      .catch((err) =>
        this.logger?.error(
          { err },
          "failed to delete user deleted user in feed_admin_rejectUser in gorse feed"
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
      .then((d: any) =>
        this.logger?.info(
          { data: d?.data, args },
          "successfully deleted items (vibes) from gorse feed in feed_admin_rejectUser"
        )
      )
      .catch((err) =>
        this.logger?.error(
          { err },
          "failed to delete items (vibes) from gorse feed in feed_admin_rejectUser"
        )
      );
  }
}
export default GorseUtil;
