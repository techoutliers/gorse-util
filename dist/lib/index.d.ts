export interface ILogger {
    debug(...n: any): void;
    info(...n: any): void;
    error(...n: any): void;
}
export declare type Init = {
    feedUrl: string;
    directoryUrl: string;
    logger?: ILogger;
};
export declare type feed_deactivate_vibes = "_id";
export declare type feed_deactivate_likeIds = "ref" | "userId";
export declare type feed_deactivate_ownLikes = "ref" | "userId";
export declare type feed_set_account_status_user_vibes = "vibeTags" | "hashtags" | "_id" | "description" | "createdAt" | "adminHidden";
export declare type feed_set_account_status_likes = "_id" | "userId" | "ref" | "createdAt";
declare class GorseUtil {
    feedUrl: string | null;
    directoryUrl: string | null;
    logger?: ILogger;
    constructor();
    init(args: Init): void;
    feed_deleteAVibe(args: {
        vibeId: string;
        likedByUserIds: string[];
    }): Promise<void>;
    feed_toggleSecretUser(args: {
        vibes: Record<string, string>[];
        status: "private" | "public";
    }): Promise<void>;
    feed_deactivate(args: {
        userId: string;
        vibes: Record<feed_deactivate_vibes, string>[];
        likeIds: Record<feed_deactivate_likeIds, string>[];
        ownLikes: Record<feed_deactivate_ownLikes, string>[];
    }): Promise<void>;
    feed_setAccountStatus(args: {
        userId: string;
        profileStatus: "public" | "private";
        userVibes: Record<feed_set_account_status_user_vibes, string>[];
        likes: Record<feed_set_account_status_likes, string>[];
    }): Promise<void>;
    feed_deleteUser(args: {
        userId: string;
        vibes: {
            _id: string;
        }[];
    }): Promise<void>;
    feed_recordScreenshot(args: {
        userId: string;
        vibes: {
            _id: string;
        }[];
    }): Promise<void>;
    feed_admin_activate(args: {
        userId: string;
        userVibes: Record<feed_set_account_status_user_vibes, string>[];
        allLikes: Record<feed_set_account_status_likes, string>[];
        profileStatus: string;
    }): Promise<void>;
    feed_admin_hideVibeAsAdmin(args: {
        vibeId: string;
        adminStatus: "hidden" | "unhidden";
    }): Promise<void>;
    feed_admin_deleteVibeAsAdmin(args: {
        vibeId: string;
    }): Promise<void>;
    feed_admin_suspendIt(args: {
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
    }): Promise<void>;
    feed_admin_deactivateUser(args: {
        userId: string;
        vibes: {
            _id: string;
        }[];
    }): Promise<void>;
    feed_admin_deleteUser(args: {
        userId: string;
        vibes: {
            _id: string;
        }[];
    }): Promise<void>;
    feed_admin_confirmUser_insertUser(args: {
        userId: string;
        profileStatus: string;
    }): Promise<void>;
    feed_admin_confirmUser_postProfPics(args: {
        userId: string;
        userVibes: Record<feed_set_account_status_user_vibes, string>[];
        profileStatus: string;
    }): Promise<void>;
    feed_admin_confirmUserAll_postProfPics(args: {
        userId: string;
        userVibes: Record<feed_set_account_status_user_vibes, string>[];
        profileStatus: string;
    }): Promise<void>;
}
export default GorseUtil;
