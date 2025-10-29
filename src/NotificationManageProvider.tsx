import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type NotificationUIData = {
  content: string;
  deepLink?: string;
  image?: string;
  type?: string;
};

export type NotificationManageContextValue = {
  token: string;
  // Notification User Interaction Effects
  onLogNotificationEvent: (type: string) => void;
  onRefreshBadgeCount: () => void;

  // Notification Foreground UI
  shouldShowNotification?: (params: NotificationUIData) => boolean;
  onBeforeShowNotification?: (params: NotificationUIData) => void;
  onRenderNotification: (
    params: NotificationUIData & { onPress?: () => void },
  ) => void;
  onNotificationPress?: (params: NotificationUIData) => void;
  onAfterShowNotification?: (params: NotificationUIData) => void;

  // Deep Link Action
  onRefreshQueriesForDeepLink: (deepLink: string) => void | Promise<void>;
  onNavigateToDeepLink: (deepLink: string) => void;
  onOpenExternalLink: (deepLink: string) => void;

  // Navigation Active Trigger
  activeNotificationNavigation: () => void;

  // Local Push Notification
  onDisplayLocalNotification: (
    notificationInfo: { title: string; message: string; largeIconUrl: string },
    userInfo: unknown,
  ) => void;
};
export const NotificationManageContext =
  createContext<NotificationManageContextValue>({
    token: "",
    // Notification User Interaction Effects
    onLogNotificationEvent: () => {},
    onRefreshBadgeCount: () => {},

    // Notification Foreground UI
    shouldShowNotification: () => true,
    onBeforeShowNotification: () => {},
    onRenderNotification: () => {},
    onNotificationPress: () => {},
    onAfterShowNotification: () => {},

    // Deep Link Action
    onRefreshQueriesForDeepLink: () => {},
    onNavigateToDeepLink: () => {},
    onOpenExternalLink: () => {},

    // Navigation Active Trigger
    activeNotificationNavigation: () => {},

    // Local Push Notification
    onDisplayLocalNotification: () => {},
  });

type NotificationManageProviderProps = PropsWithChildren<{
  // Environment management
  onSetupForegroundBehavior: () => void;
  onCreateNotificationChannel: () => void;

  // Token management
  onRequestNotificationPermission: () => Promise<void>;
  onEnsureDeviceRegistration: () => Promise<void>;
  onFetchNotificationToken: () => Promise<string> | string;
  onRegisterTokenToServer?: (token: string) => Promise<any>;
  onSubscribeToTokenRefresh: (
    callback: (newToken: string) => void,
  ) => () => void;
  onLoadStoredToken: () => Promise<string>;
  onSaveToken: (token: string) => Promise<void> | void;
  onTokenInitializationError?: (error: unknown) => void;
  onTokenChangeError?: (error: unknown) => void;

  // Notification User Interaction Effects
  onLogNotificationEvent: (type: string) => void;
  onRefreshBadgeCount: () => void;

  // Deep Link Action
  onRefreshQueriesForDeepLink: (deepLink: string) => void | Promise<void>;
  onNavigateToDeepLink: (deepLink: string) => void;
  onOpenExternalLink: (deepLink: string) => void;

  // Notification Foreground UI
  shouldShowNotification?: (params: NotificationUIData) => boolean;
  onBeforeShowNotification?: (params: NotificationUIData) => void;
  onRenderNotification: (
    params: NotificationUIData & { onPress?: () => void },
  ) => void;
  onNotificationPress?: (params: NotificationUIData) => void;
  onAfterShowNotification?: (params: NotificationUIData) => void;

  // Local Push Notification
  onDisplayLocalNotification: (
    notificationInfo: { title: string; message: string; largeIconUrl: string },
    userInfo: unknown,
  ) => void;
}>;

export const NotificationManageProvider = ({
  children,
  // Environment management
  onSetupForegroundBehavior,
  onCreateNotificationChannel,

  // Token management
  onRequestNotificationPermission,
  onEnsureDeviceRegistration,
  onFetchNotificationToken,
  onRegisterTokenToServer,
  onSubscribeToTokenRefresh,
  onLoadStoredToken,
  onSaveToken,
  onTokenInitializationError,
  onTokenChangeError,

  // Notification User Interaction Effects
  onLogNotificationEvent,
  onRefreshBadgeCount,

  // Notification Foreground UI
  shouldShowNotification,
  onBeforeShowNotification,
  onRenderNotification,
  onNotificationPress,
  onAfterShowNotification,

  // Deep Link Action
  onRefreshQueriesForDeepLink,
  onNavigateToDeepLink: _onNavigateToDeepLink,
  onOpenExternalLink,

  // Local Push Notification
  onDisplayLocalNotification,
}: NotificationManageProviderProps) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    onSetupForegroundBehavior();
    onCreateNotificationChannel();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await onRequestNotificationPermission();
        await onEnsureDeviceRegistration();

        const responseToken = await onFetchNotificationToken();
        setToken(responseToken);
        await onRegisterTokenToServer?.(responseToken);
        onSaveToken(responseToken);
      } catch (error) {
        onTokenInitializationError?.(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (token) {
        try {
          const prevToken = await onLoadStoredToken();
          if (prevToken !== token) {
            await onRegisterTokenToServer?.(token);
            onSaveToken(token);
          }
        } catch (error) {
          onTokenChangeError?.(error);
        }
      }
    })();
  }, [token]);

  useEffect(() => {
    return onSubscribeToTokenRefresh(setToken);
  }, []);

  const [isNotificationNavigationActive, setIsNotificationNavigationActive] =
    useState(false);
  const isNotificationNavigationActiveRef = useRef(false);
  const activeNotificationNavigation = useCallback(() => {
    setIsNotificationNavigationActive(true);
    isNotificationNavigationActiveRef.current = true;
  }, []);

  const navigationDeepLink = useRef<string>("");
  const onNavigateToDeepLink = useCallback(
    (deepLink: string) => {
      if (
        isNotificationNavigationActiveRef.current &&
        !navigationDeepLink.current
      ) {
        _onNavigateToDeepLink(deepLink);
      } else {
        navigationDeepLink.current = deepLink;
      }
    },
    [isNotificationNavigationActive],
  );

  useEffect(() => {
    if (isNotificationNavigationActive && navigationDeepLink.current) {
      _onNavigateToDeepLink(navigationDeepLink.current);
      navigationDeepLink.current = "";
    }
  }, [isNotificationNavigationActive]);

  const contextValue: NotificationManageContextValue = useMemo(
    () => ({
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
    }),
    [
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
    ],
  );
  return (
    <NotificationManageContext.Provider value={contextValue}>
      {children}
    </NotificationManageContext.Provider>
  );
};

export const useNotificationManage = (
  overrideTargetProps: Partial<NotificationManageContextValue> = {},
) => {
  const context = useContext(NotificationManageContext);
  if (!context) {
    throw new Error(
      "useNotificationManage must be used within a NotificationManageProvider",
    );
  }

  return {
    ...context,
    ...overrideTargetProps,
  };
};
