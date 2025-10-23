export interface ReactNativeNotification {
  data: {
    type?: string;
    action?: string;
    [key: string]: string | number | undefined;
  };
}

export const parseReactNativeNotification = (
  notification: ReactNativeNotification,
) => {
  const type = notification?.data?.type;
  const deepLink = notification?.data?.action;
  return { type, deepLink, raw: notification };
};
