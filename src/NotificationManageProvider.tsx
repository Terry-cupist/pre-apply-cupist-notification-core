import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type NotificationManageContextValue = {
  token: string;
};
export const NotificationManageContext =
  createContext<NotificationManageContextValue>({
    token: "",
  });

type NotificationManageProviderProps = PropsWithChildren<{
  checkPermission: () => Promise<void>;
  checkRegisteredDevice: () => Promise<void>;
  getToken: () => Promise<string> | string;
  registerTokenApi?: (token: string) => Promise<any>;
  refreshTokenListener: (callback: (newToken: string) => void) => () => void;
  getStoredToken: () => Promise<string>;
  setStoredToken: (token: string) => Promise<void> | void;
  onInitializeTokenError?: (error: unknown) => void;
  onTokenChangeError?: (error: unknown) => void;
}>;

export const NotificationManageProvider = ({
  children,
  checkPermission,
  checkRegisteredDevice,
  getToken,
  registerTokenApi,
  refreshTokenListener,
  getStoredToken,
  setStoredToken,
  onInitializeTokenError,
  onTokenChangeError,
}: NotificationManageProviderProps) => {
  const [token, setToken] = useState("");

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

  const contextValue: NotificationManageContextValue = useMemo(
    () => ({ token }),
    [token],
  );
  return (
    <NotificationManageContext.Provider value={contextValue}>
      {children}
    </NotificationManageContext.Provider>
  );
};

export const useNotificationManage = () => {
  const context = useContext(NotificationManageContext);
  if (!context) {
    throw new Error(
      "useNotificationManage must be used within a NotificationManageProvider",
    );
  }
  return context;
};
