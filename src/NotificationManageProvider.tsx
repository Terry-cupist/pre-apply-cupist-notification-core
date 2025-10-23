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
  getToken: () => Promise<string>;
  registerTokenApi: (token: string) => Promise<void>;
  refreshTokenListener: (callback: (newToken: string) => void) => () => void;
  onError: (error: unknown) => void;
  getStoredToken: () => Promise<string>;
  setStoredToken: (token: string) => Promise<void> | void;
}>;

export const NotificationManageProvider = ({
  children,
  checkPermission,
  checkRegisteredDevice,
  getToken,
  registerTokenApi,
  refreshTokenListener,
  onError,
  getStoredToken,
  setStoredToken,
}: NotificationManageProviderProps) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await checkPermission();
        await checkRegisteredDevice();

        const responseToken = await getToken();
        setToken(responseToken);
        await registerTokenApi(responseToken);
        setStoredToken(responseToken);
      } catch (error) {
        onError(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (token) {
        const prevToken = await getStoredToken();
        if (prevToken !== token) {
          await registerTokenApi(token);
          setStoredToken(token);
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
