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
  sendNotificationUserEvent: (type: string) => void;
  refreshDeepLinkApis: (deepLink: string) => void | Promise<void>;
  navigateToLink: (deepLink: string) => void;
  openLink: (deepLink: string) => void;
  refreshBadgeCount: () => void;
  checkIsToastOpenValid?: (params: NotificationUIData) => boolean;
  beforeOpenNotificationUI?: (params: NotificationUIData) => void;
  openToast: (params: NotificationUIData & { onPress?: () => void }) => void;
  onToastPress?: (params: NotificationUIData) => void;
  afterOpenToast?: (params: NotificationUIData) => void;
  localPushNotification: (
    notificationInfo: { title: string; message: string; largeIconUrl: string },
    userInfo: unknown,
  ) => void;
  activeNotificationNavigation: () => void;
};
export const NotificationManageContext =
  createContext<NotificationManageContextValue>({
    token: "",
    sendNotificationUserEvent: () => {},
    refreshDeepLinkApis: () => {},
    navigateToLink: () => {},
    openLink: () => {},
    refreshBadgeCount: () => {},
    checkIsToastOpenValid: () => true,
    beforeOpenNotificationUI: () => {},
    openToast: () => {},
    onToastPress: () => {},
    afterOpenToast: () => {},
    localPushNotification: () => {},
    activeNotificationNavigation: () => {},
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
  // Notification handler events
  sendNotificationUserEvent: (type: string) => void;
  refreshDeepLinkApis: (deepLink: string) => void | Promise<void>;
  navigateToLink: (deepLink: string) => void;
  openLink: (deepLink: string) => void;
  refreshBadgeCount: () => void;
  checkIsToastOpenValid?: (params: NotificationUIData) => boolean;
  beforeOpenNotificationUI?: (params: NotificationUIData) => void;
  openToast: (params: NotificationUIData & { onPress?: () => void }) => void;
  onToastPress?: (params: NotificationUIData) => void;
  afterOpenToast?: (params: NotificationUIData) => void;
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
  // Notification handler events
  sendNotificationUserEvent,
  refreshDeepLinkApis,
  navigateToLink: _navigateToLink,
  openLink,
  refreshBadgeCount,
  checkIsToastOpenValid,
  beforeOpenNotificationUI,
  openToast,
  onToastPress,
  afterOpenToast,
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
  const activeNotificationNavigation = useCallback(() => {
    setIsNotificationNavigationActive(true);
  }, []);

  const navigationDeepLink = useRef<string>("");
  const navigateToLink = useCallback(
    (deepLink: string) => {
      if (isNotificationNavigationActive && !navigationDeepLink.current) {
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
      sendNotificationUserEvent,
      refreshDeepLinkApis,
      navigateToLink,
      openLink,
      refreshBadgeCount,
      checkIsToastOpenValid,
      beforeOpenNotificationUI,
      openToast,
      onToastPress,
      afterOpenToast,
      localPushNotification,
      activeNotificationNavigation,
    }),
    [
      token,
      sendNotificationUserEvent,
      refreshDeepLinkApis,
      navigateToLink,
      openLink,
      refreshBadgeCount,
      checkIsToastOpenValid,
      beforeOpenNotificationUI,
      openToast,
      onToastPress,
      afterOpenToast,
      localPushNotification,
      activeNotificationNavigation,
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
