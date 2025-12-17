export interface ReactNativeNotification {
    data: {
        type?: string;
        action?: string;
        [key: string]: string | number | undefined;
    };
}
export declare const parseReactNativeNotification: (notification: ReactNativeNotification) => {
    type: string | undefined;
    deepLink: string | undefined;
    raw: ReactNativeNotification;
};
//# sourceMappingURL=reactNative.d.ts.map