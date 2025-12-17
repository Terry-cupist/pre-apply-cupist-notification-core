"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNotificationManage = exports.NotificationManageProvider = exports.NotificationManageContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
exports.NotificationManageContext = (0, react_1.createContext)({
    token: "",
    // Notification User Interaction Effects
    onLogNotificationEvent: () => { },
    onRefreshBadgeCount: () => { },
    // Notification Foreground UI
    shouldShowNotification: () => true,
    onBeforeShowNotification: () => { },
    onRenderNotification: () => { },
    onNotificationPress: () => { },
    onAfterShowNotification: () => { },
    // Deep Link Action
    onRefreshQueriesForDeepLink: () => { },
    onNavigateToDeepLink: () => { },
    onOpenExternalLink: () => { },
    // Navigation Active Trigger
    activeNotificationNavigation: () => { },
    // Local Push Notification
    onDisplayLocalNotification: () => { },
});
const NotificationManageProvider = ({ children, 
// Environment management
onSetupForegroundBehavior, onCreateNotificationChannel, 
// Token management
onRequestNotificationPermission, onEnsureDeviceRegistration, onFetchNotificationToken, onRegisterTokenToServer, onSubscribeToTokenRefresh, onLoadStoredToken, onSaveToken, onTokenInitializationError, onTokenChangeError, 
// Notification User Interaction Effects
onLogNotificationEvent, onRefreshBadgeCount, 
// Notification Foreground UI
shouldShowNotification, onBeforeShowNotification, onRenderNotification, onNotificationPress, onAfterShowNotification, 
// Deep Link Action
onRefreshQueriesForDeepLink, onNavigateToDeepLink: _onNavigateToDeepLink, onOpenExternalLink, 
// Local Push Notification
onDisplayLocalNotification, }) => {
    const [token, setToken] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        onSetupForegroundBehavior();
        onCreateNotificationChannel();
    }, []);
    (0, react_1.useEffect)(() => {
        (async () => {
            try {
                await onRequestNotificationPermission();
                await onEnsureDeviceRegistration();
                const responseToken = await onFetchNotificationToken();
                setToken(responseToken);
                await (onRegisterTokenToServer === null || onRegisterTokenToServer === void 0 ? void 0 : onRegisterTokenToServer(responseToken));
                onSaveToken(responseToken);
            }
            catch (error) {
                onTokenInitializationError === null || onTokenInitializationError === void 0 ? void 0 : onTokenInitializationError(error);
            }
        })();
    }, []);
    (0, react_1.useEffect)(() => {
        (async () => {
            if (token) {
                try {
                    const prevToken = await onLoadStoredToken();
                    if (prevToken !== token) {
                        await (onRegisterTokenToServer === null || onRegisterTokenToServer === void 0 ? void 0 : onRegisterTokenToServer(token));
                        onSaveToken(token);
                    }
                }
                catch (error) {
                    onTokenChangeError === null || onTokenChangeError === void 0 ? void 0 : onTokenChangeError(error);
                }
            }
        })();
    }, [token]);
    (0, react_1.useEffect)(() => {
        return onSubscribeToTokenRefresh(setToken);
    }, []);
    const [isNotificationNavigationActive, setIsNotificationNavigationActive] = (0, react_1.useState)(false);
    const isNotificationNavigationActiveRef = (0, react_1.useRef)(false);
    const activeNotificationNavigation = (0, react_1.useCallback)(() => {
        setIsNotificationNavigationActive(true);
        isNotificationNavigationActiveRef.current = true;
    }, []);
    const navigationDeepLink = (0, react_1.useRef)("");
    const onNavigateToDeepLink = (0, react_1.useCallback)((deepLink) => {
        if (isNotificationNavigationActiveRef.current &&
            !navigationDeepLink.current) {
            _onNavigateToDeepLink(deepLink);
        }
        else {
            navigationDeepLink.current = deepLink;
        }
    }, [isNotificationNavigationActive]);
    (0, react_1.useEffect)(() => {
        if (isNotificationNavigationActive && navigationDeepLink.current) {
            _onNavigateToDeepLink(navigationDeepLink.current);
            navigationDeepLink.current = "";
        }
    }, [isNotificationNavigationActive]);
    const contextValue = (0, react_1.useMemo)(() => ({
        token,
        // Notification User Interaction Effects
        onLogNotificationEvent,
        onRefreshBadgeCount,
        // Deep Link Action
        onRefreshQueriesForDeepLink,
        onNavigateToDeepLink,
        onOpenExternalLink,
        // Notification Foreground UI
        shouldShowNotification,
        onBeforeShowNotification,
        onRenderNotification,
        onNotificationPress,
        onAfterShowNotification,
        // Navigation Active Trigger
        activeNotificationNavigation,
        // Local Push Notification
        onDisplayLocalNotification,
    }), [
        token,
        // Notification User Interaction Effects
        onLogNotificationEvent,
        onRefreshBadgeCount,
        // Deep Link Action
        onRefreshQueriesForDeepLink,
        onNavigateToDeepLink,
        onOpenExternalLink,
        // Notification Foreground UI
        shouldShowNotification,
        onBeforeShowNotification,
        onRenderNotification,
        onNotificationPress,
        onAfterShowNotification,
        // Navigation Active Trigger
        activeNotificationNavigation,
        // Local Push Notification
        onDisplayLocalNotification,
    ]);
    return ((0, jsx_runtime_1.jsx)(exports.NotificationManageContext.Provider, { value: contextValue, children: children }));
};
exports.NotificationManageProvider = NotificationManageProvider;
const useNotificationManage = (overrideTargetProps = {}) => {
    const context = (0, react_1.useContext)(exports.NotificationManageContext);
    if (!context) {
        throw new Error("useNotificationManage must be used within a NotificationManageProvider");
    }
    return {
        ...context,
        ...overrideTargetProps,
    };
};
exports.useNotificationManage = useNotificationManage;
//# sourceMappingURL=NotificationManageProvider.js.map