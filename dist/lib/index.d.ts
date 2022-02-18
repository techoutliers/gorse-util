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
}
export default GorseUtil;
