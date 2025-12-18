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
        console.log('🚀 [NotificationManageProvider] 초기화 시작');
        onSetupForegroundBehavior();
        console.log('✅ [NotificationManageProvider] Foreground behavior 설정 완료');
        onCreateNotificationChannel();
        console.log('✅ [NotificationManageProvider] Notification channel 생성 완료');
    }, []);
    (0, react_1.useEffect)(() => {
        (async () => {
            try {
                console.log('🔑 [NotificationManageProvider] 토큰 초기화 시작');
                await onRequestNotificationPermission();
                console.log('✅ [NotificationManageProvider] 알림 권한 요청 완료');
                await onEnsureDeviceRegistration();
                console.log('✅ [NotificationManageProvider] 디바이스 등록 완료');
                const responseToken = await onFetchNotificationToken();
                console.log('📱 [NotificationManageProvider] 토큰 가져오기 완료:', responseToken);
                setToken(responseToken);
                await (onRegisterTokenToServer === null || onRegisterTokenToServer === void 0 ? void 0 : onRegisterTokenToServer(responseToken));
                console.log('📤 [NotificationManageProvider] 서버에 토큰 등록 완료');
                onSaveToken(responseToken);
                console.log('💾 [NotificationManageProvider] 토큰 저장 완료');
            }
            catch (error) {
                console.error('❌ [NotificationManageProvider] 토큰 초기화 실패:', error);
                onTokenInitializationError === null || onTokenInitializationError === void 0 ? void 0 : onTokenInitializationError(error);
            }
        })();
    }, []);
    (0, react_1.useEffect)(() => {
        (async () => {
            if (token) {
                try {
                    console.log('🔄 [NotificationManageProvider] 토큰 변경 감지:', token);
                    const prevToken = await onLoadStoredToken();
                    console.log('📥 [NotificationManageProvider] 이전 토큰 로드:', prevToken);
                    if (prevToken !== token) {
                        console.log('🆕 [NotificationManageProvider] 토큰 변경됨, 서버에 등록 시작');
                        await (onRegisterTokenToServer === null || onRegisterTokenToServer === void 0 ? void 0 : onRegisterTokenToServer(token));
                        console.log('📤 [NotificationManageProvider] 서버에 새 토큰 등록 완료');
                        onSaveToken(token);
                        console.log('💾 [NotificationManageProvider] 새 토큰 저장 완료');
                    }
                    else {
                        console.log('✓ [NotificationManageProvider] 토큰 변경 없음');
                    }
                }
                catch (error) {
                    console.error('❌ [NotificationManageProvider] 토큰 변경 처리 실패:', error);
                    onTokenChangeError === null || onTokenChangeError === void 0 ? void 0 : onTokenChangeError(error);
                }
            }
        })();
    }, [token]);
    (0, react_1.useEffect)(() => {
        console.log('🔔 [NotificationManageProvider] 토큰 갱신 구독 시작');
        return onSubscribeToTokenRefresh((newToken) => {
            console.log('🆕 [NotificationManageProvider] 토큰 갱신됨:', newToken);
            setToken(newToken);
        });
    }, []);
    const [isNotificationNavigationActive, setIsNotificationNavigationActive] = (0, react_1.useState)(false);
    const isNotificationNavigationActiveRef = (0, react_1.useRef)(false);
    const activeNotificationNavigation = (0, react_1.useCallback)(() => {
        console.log('🧭 [NotificationManageProvider] 알림 네비게이션 활성화');
        setIsNotificationNavigationActive(true);
        isNotificationNavigationActiveRef.current = true;
    }, []);
    const navigationDeepLink = (0, react_1.useRef)("");
    const onNavigateToDeepLink = (0, react_1.useCallback)((deepLink) => {
        console.log('🔗 [NotificationManageProvider] 딥링크 네비게이션 요청:', deepLink);
        if (isNotificationNavigationActiveRef.current &&
            !navigationDeepLink.current) {
            console.log('➡️ [NotificationManageProvider] 즉시 네비게이션 실행');
            _onNavigateToDeepLink(deepLink);
        }
        else {
            console.log('⏸️ [NotificationManageProvider] 딥링크 대기 상태로 저장');
            navigationDeepLink.current = deepLink;
        }
    }, [isNotificationNavigationActive]);
    (0, react_1.useEffect)(() => {
        if (isNotificationNavigationActive && navigationDeepLink.current) {
            console.log('🚀 [NotificationManageProvider] 대기 중인 딥링크 실행:', navigationDeepLink.current);
            _onNavigateToDeepLink(navigationDeepLink.current);
            navigationDeepLink.current = "";
            console.log('✅ [NotificationManageProvider] 딥링크 실행 완료, 대기 상태 초기화');
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