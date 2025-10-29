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
  sendNotificationUserEvent: (type: string) => void;
  refreshBadgeCount: () => void;

  // Notification Foreground UI
  checkIsNotificationOpenValid?: (params: NotificationUIData) => boolean;
  beforeOpenNotificationUI?: (params: NotificationUIData) => void;
  openNotificationUI: (
    params: NotificationUIData & { onPress?: () => void },
  ) => void;
  onNotificationUIPress?: (params: NotificationUIData) => void;
  afterOpenNotificationUI?: (params: NotificationUIData) => void;

  // Deep Link Action
  refreshDeepLinkApis: (deepLink: string) => void | Promise<void>;
  navigateToLink: (deepLink: string) => void;
  openLink: (deepLink: string) => void;

  // Navigation Active Trigger
  activeNotificationNavigation: () => void;

  // Local Push Notification
  localPushNotification: (
    notificationInfo: { title: string; message: string; largeIconUrl: string },
    userInfo: unknown,
  ) => void;
};
export const NotificationManageContext =
  createContext<NotificationManageContextValue>({
    token: "",
    // Notification User Interaction Effects
    sendNotificationUserEvent: () => {},
    refreshBadgeCount: () => {},

    // Notification Foreground UI
    checkIsNotificationOpenValid: () => true,
    beforeOpenNotificationUI: () => {},
    openNotificationUI: () => {},
    onNotificationUIPress: () => {},
    afterOpenNotificationUI: () => {},

    // Deep Link Action
    refreshDeepLinkApis: () => {},
    navigateToLink: () => {},
    openLink: () => {},

    // Navigation Active Trigger
    activeNotificationNavigation: () => {},

    // Local Push Notification
    localPushNotification: () => {},
  });

type NotificationManageProviderProps = PropsWithChildren<{
  // Environment management
  setForegroundNotificationHandler: () => void;
  createChannel: () => void;

  // Token management
  checkPermission: () => Promise<void>;
  checkRegisteredDevice: () => Promise<void>;
  getToken: () => Promise<string> | string;
  registerTokenApi?: (token: string) => Promise<any>;
  refreshTokenListener: (callback: (newToken: string) => void) => () => void;
  getStoredToken: () => Promise<string>;
  setStoredToken: (token: string) => Promise<void> | void;
  onInitializeTokenError?: (error: unknown) => void;
  onTokenChangeError?: (error: unknown) => void;

  // Notification User Interaction Effects
  sendNotificationUserEvent: (type: string) => void;
  refreshBadgeCount: () => void;

  // Deep Link Action
  refreshDeepLinkApis: (deepLink: string) => void | Promise<void>;
  navigateToLink: (deepLink: string) => void;
  openLink: (deepLink: string) => void;

  // Notification Foreground UI
  checkIsNotificationOpenValid?: (params: NotificationUIData) => boolean;
  beforeOpenNotificationUI?: (params: NotificationUIData) => void;
  openNotificationUI: (
    params: NotificationUIData & { onPress?: () => void },
  ) => void;
  onNotificationUIPress?: (params: NotificationUIData) => void;
  afterOpenNotificationUI?: (params: NotificationUIData) => void;

  // Local Push Notification
  localPushNotification: (
    notificationInfo: { title: string; message: string; largeIconUrl: string },
    userInfo: unknown,
  ) => void;
}>;

export const NotificationManageProvider = ({
  children,
  // Environment management
  setForegroundNotificationHandler,
  createChannel,

  // Token management
  checkPermission,
  checkRegisteredDevice,
  getToken,
  registerTokenApi,
  refreshTokenListener,
  getStoredToken,
  setStoredToken,
  onInitializeTokenError,
  onTokenChangeError,

  // Notification User Interaction Effects
  sendNotificationUserEvent,
  refreshBadgeCount,

  // Notification Foreground UI
  checkIsNotificationOpenValid,
  beforeOpenNotificationUI,
  openNotificationUI,
  onNotificationUIPress,
  afterOpenNotificationUI,

  // Deep Link Action
  refreshDeepLinkApis,
  navigateToLink: _navigateToLink,
  openLink,

  // Local Push Notification
  localPushNotification,
}: NotificationManageProviderProps) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    setForegroundNotificationHandler();
    createChannel();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await checkPermission();
        await checkRegisteredDevice();

        const responseToken = await getToken();
        setToken(responseToken);
        await registerTokenApi?.(responseToken);
        setStoredToken(responseToken);
      } catch (error) {
        onInitializeTokenError?.(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (token) {
        try {
          const prevToken = await getStoredToken();
          if (prevToken !== token) {
            await registerTokenApi?.(token);
            setStoredToken(token);
          }
        } catch (error) {
          onTokenChangeError?.(error);
        }
      }
    })();
  }, [token]);

  useEffect(() => {
    return refreshTokenListener(setToken);
  }, []);

  const [isNotificationNavigationActive, setIsNotificationNavigationActive] =
    useState(false);
  const isNotificationNavigationActiveRef = useRef(false);
  const activeNotificationNavigation = useCallback(() => {
    setIsNotificationNavigationActive(true);
    isNotificationNavigationActiveRef.current = true;
  }, []);

  const navigationDeepLink = useRef<string>("");
  const navigateToLink = useCallback(
    (deepLink: string) => {
      if (
        isNotificationNavigationActiveRef.current &&
        !navigationDeepLink.current
      ) {
        _navigateToLink(deepLink);
      } else {
        navigationDeepLink.current = deepLink;
      }
    },
    [isNotificationNavigationActive],
  );

  useEffect(() => {
    if (isNotificationNavigationActive && navigationDeepLink.current) {
      _navigateToLink(navigationDeepLink.current);
      navigationDeepLink.current = "";
    }
  }, [isNotificationNavigationActive]);

  const contextValue: NotificationManageContextValue = useMemo(
    () => ({
      token,

      // Notification User Interaction Effects
      sendNotificationUserEvent,
      refreshBadgeCount,

      // Deep Link Action
      refreshDeepLinkApis,
      navigateToLink,
      openLink,

      // Notification Foreground UI
      checkIsNotificationOpenValid,
      beforeOpenNotificationUI,
      openNotificationUI,
      onNotificationUIPress,
      afterOpenNotificationUI,

      // Navigation Active Trigger
      activeNotificationNavigation,

      // Local Push Notification
      localPushNotification,
    }),
    [
      token,

      // Notification User Interaction Effects
      sendNotificationUserEvent,
      refreshBadgeCount,

      // Deep Link Action
      refreshDeepLinkApis,
      navigateToLink,
      openLink,

      // Notification Foreground UI
      checkIsNotificationOpenValid,
      beforeOpenNotificationUI,
      openNotificationUI,
      onNotificationUIPress,
      afterOpenNotificationUI,

      // Navigation Active Trigger
      activeNotificationNavigation,

      // Local Push Notification
      localPushNotification,
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
