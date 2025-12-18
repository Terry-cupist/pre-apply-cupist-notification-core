import { PropsWithChildren } from "react";
export type NotificationUIData = {
    content: string;
    deepLink?: string;
    image?: string;
    type?: string;
};
export type NotificationManageContextValue = {
    token: string;
    onLogNotificationEvent: (type: string) => void;
    onRefreshBadgeCount: () => void;
    shouldShowNotification?: (params: NotificationUIData) => boolean;
    onBeforeShowNotification?: (params: NotificationUIData) => void;
    onRenderNotification: (params: NotificationUIData & {
        onPress?: () => void;
    }) => void;
    onNotificationPress?: (params: NotificationUIData) => void;
    onAfterShowNotification?: (params: NotificationUIData) => void;
    onRefreshQueriesForDeepLink: (deepLink: string) => void | Promise<void>;
    onNavigateToDeepLink: (deepLink: string) => void;
    onOpenExternalLink: (deepLink: string) => void;
    activeNotificationNavigation: () => void;
    onDisplayLocalNotification: (notificationInfo: {
        title: string;
        message: string;
        largeIconUrl: string;
    }, userInfo: unknown) => void;
};
export declare const NotificationManageContext: import("react").Context<NotificationManageContextValue>;
type NotificationManageProviderProps = PropsWithChildren<{
    notificationAvailableKey?: string;
    onSetupForegroundBehavior: () => void;
    onCreateNotificationChannel: () => void;
    onRequestNotificationPermission: () => Promise<void>;
    onEnsureDeviceRegistration: () => Promise<void>;
    onFetchNotificationToken: () => Promise<string> | string;
    onRegisterTokenToServer?: (token: string) => Promise<any>;
    onSubscribeToTokenRefresh: (callback: (newToken: string) => void) => () => void;
    onLoadStoredToken: () => Promise<string>;
    onSaveToken: (token: string) => Promise<void> | void;
    onTokenInitializationError?: (error: unknown) => void;
    onTokenChangeError?: (error: unknown) => void;
    onLogNotificationEvent: (type: string) => void;
    onRefreshBadgeCount: () => void;
    onRefreshQueriesForDeepLink: (deepLink: string) => void | Promise<void>;
    onNavigateToDeepLink: (deepLink: string) => void;
    onOpenExternalLink: (deepLink: string) => void;
    shouldShowNotification?: (params: NotificationUIData) => boolean;
    onBeforeShowNotification?: (params: NotificationUIData) => void;
    onRenderNotification: (params: NotificationUIData & {
        onPress?: () => void;
    }) => void;
    onNotificationPress?: (params: NotificationUIData) => void;
    onAfterShowNotification?: (params: NotificationUIData) => void;
    onDisplayLocalNotification: (notificationInfo: {
        title: string;
        message: string;
        largeIconUrl: string;
    }, userInfo: unknown) => void;
}>;
export declare const NotificationManageProvider: ({ notificationAvailableKey, children, onSetupForegroundBehavior, onCreateNotificationChannel, onRequestNotificationPermission, onEnsureDeviceRegistration, onFetchNotificationToken, onRegisterTokenToServer, onSubscribeToTokenRefresh, onLoadStoredToken, onSaveToken, onTokenInitializationError, onTokenChangeError, onLogNotificationEvent, onRefreshBadgeCount, shouldShowNotification, onBeforeShowNotification, onRenderNotification, onNotificationPress, onAfterShowNotification, onRefreshQueriesForDeepLink, onNavigateToDeepLink: _onNavigateToDeepLink, onOpenExternalLink, onDisplayLocalNotification, }: NotificationManageProviderProps) => import("react/jsx-runtime").JSX.Element;
export declare const useNotificationManage: (overrideTargetProps?: Partial<NotificationManageContextValue>) => {
    token: string;
    onLogNotificationEvent: (type: string) => void;
    onRefreshBadgeCount: () => void;
    shouldShowNotification?: (params: NotificationUIData) => boolean;
    onBeforeShowNotification?: (params: NotificationUIData) => void;
    onRenderNotification: (params: NotificationUIData & {
        onPress?: () => void;
    }) => void;
    onNotificationPress?: (params: NotificationUIData) => void;
    onAfterShowNotification?: (params: NotificationUIData) => void;
    onRefreshQueriesForDeepLink: (deepLink: string) => void | Promise<void>;
    onNavigateToDeepLink: (deepLink: string) => void;
    onOpenExternalLink: (deepLink: string) => void;
    activeNotificationNavigation: () => void;
    onDisplayLocalNotification: (notificationInfo: {
        title: string;
        message: string;
        largeIconUrl: string;
    }, userInfo: unknown) => void;
};
export {};
//# sourceMappingURL=NotificationManageProvider.d.ts.map