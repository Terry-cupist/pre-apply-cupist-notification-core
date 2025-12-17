export interface ExpoNotification {
    request: {
        content: {
            body?: string;
            title?: string;
            data?: Record<string, any>;
        };
        trigger: NotificationTrigger;
    };
}
export interface NotificationTrigger {
    type: "push" | "timeInterval" | "calendar" | "location" | "unknown";
    payload?: NotificationPayload;
}
export interface NotificationPayload {
    ab_uri?: string;
    display?: string;
    type?: string;
    [key: string]: any;
}
export declare const parseExpoForegroundMessage: (message: ExpoNotification) => {
    deepLink: string;
    content: string;
    internalImage: string;
    type: string;
    raw: ExpoNotification;
};
export interface NotificationContent {
    data: {
        type?: string;
        action?: string;
    };
}
export interface ExpoNotificationResponse {
    notification: {
        request: {
            trigger: NotificationTrigger;
            content: NotificationContent;
        };
    };
}
export declare const parseExpoNotificationResponse: (response: ExpoNotificationResponse) => {
    deepLink: string;
    type: string;
    raw: ExpoNotificationResponse;
};
//# sourceMappingURL=expo.d.ts.map