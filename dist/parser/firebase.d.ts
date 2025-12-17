export interface RemoteMessage {
    data?: {
        type?: string;
        display?: string;
        a?: string | number;
        uri?: string;
        [key: string]: string | number | undefined;
    };
    notification?: {
        title?: string;
        body?: string;
        image?: string;
    };
    messageId?: string;
    from?: string;
    collapseKey?: string;
    sentTime?: number;
}
export interface DisplayJSON {
    title?: string;
    body?: string;
    icon_path?: string;
    internal_title?: string;
    internal_body?: string;
    internal_icon_path?: string;
    action?: string;
    type?: string;
}
export declare const parseFCMForegroundMessage: (message: RemoteMessage) => {
    content: string;
    deepLink: string;
    internalImage: string;
    type: string;
    raw: RemoteMessage;
};
export declare const parseFCMBackgroundMessage: (message: RemoteMessage) => {
    title: string | undefined;
    message: string | undefined;
    largeIconUrl: string | undefined;
    bigPictureUrl: string | undefined;
    type: string | undefined;
    display: DisplayJSON | null;
    raw: RemoteMessage;
};
export declare const parseFCMBackgroundClickMessage: (message: RemoteMessage) => {
    deepLink: any;
    type: string | undefined;
    raw: RemoteMessage;
};
export declare const parseFCMQuitClickMessage: (message: RemoteMessage) => {
    deepLink: any;
    type: string | undefined;
    raw: RemoteMessage;
};
//# sourceMappingURL=firebase.d.ts.map