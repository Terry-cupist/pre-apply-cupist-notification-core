export interface RemoteMessage {
  data?: {
    type?: string;
    display?: string;
    a?: string | number;
    uri?: string;
    [key: string]: string | number | undefined;
  };
  notification?: {
    title?: string;
    body?: string;
    image?: string;
  };
  messageId?: string;
  from?: string;
  collapseKey?: string;
  sentTime?: number;
}

interface DisplayJSON {
  title?: string;
  body?: string;
  icon_path?: string;
  internal_title?: string;
  internal_body?: string;
  internal_icon_path?: string;
  action?: string;
}

export const parseFCMForegroundMessage = (message: RemoteMessage) => {
  let content = "";
  let deepLink = "";
  let internalImage = "";
  const type = message.data?.type as string;

  if (message.data?.display) {
    const display = JSON.parse(message.data.display as string);
    content = display.internal_body;
    deepLink = display.action;
    internalImage = display.internal_icon_path;
  }

  return { content, deepLink, internalImage, type, raw: message };
};

export const parseFCMBackgroundMessage = (message: RemoteMessage) => {
  const display = message?.data?.display ?? message?.data?.data;
  const type = message?.data?.type ?? "";
  let displayJson = null;
  if (display) {
    if (typeof display === "string") {
      displayJson = JSON.parse(display) as DisplayJSON;
    } else if (typeof display === "object") {
      displayJson = display as DisplayJSON;
    }

    if (type) {
      displayJson = {
        ...displayJson,
        type,
      };
    }
  }

  const title = displayJson?.title;
  const displayMessage = displayJson?.body;
  const largeIconUrl = displayJson?.icon_path;
  const bigPictureUrl = displayJson?.icon_path;
  return {
    title,
    message: displayMessage,
    largeIconUrl,
    bigPictureUrl,
    type,
    raw: message,
  };
};

export const parseFCMBackgroundClickMessage = (message: RemoteMessage) => {
  const display = message?.data?.display as string | undefined;
  const trigger = display ? JSON.parse(display) : {};
  const deepLink = trigger?.action;
  return { deepLink, raw: message };
};

export const parseFCMQuitClickMessage = (message: RemoteMessage) => {
  const parsedDisplay = message?.data?.display as string | undefined;
  const trigger = parsedDisplay ? JSON.parse(parsedDisplay) : {};
  const deepLink = trigger?.action;
  const type = message?.data?.type;
  return { deepLink, type, raw: message };
};
