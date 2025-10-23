export interface ExpoNotification {
  request: {
    content: {
      body?: string;
      title?: string;
      data?: Record<string, any>;
    };
    trigger: NotificationTrigger;
  };
}

export interface NotificationTrigger {
  type: "push" | "timeInterval" | "calendar" | "location" | "unknown";
  payload?: NotificationPayload;
}

export interface NotificationPayload {
  ab_uri?: string;
  display?: string;
  type?: string;
  [key: string]: any;
}

export const parseExpoForegroundMessage = (message: ExpoNotification) => {
  const trigger = message.request.trigger;
  const displayJson = trigger?.payload?.display;

  let deepLink = "";
  let content = message.request.content.body;
  let internalImage = "";
  let type = "";

  // Braze DeepLink 처리 --> 사용하는 단에서
  //   if (trigger.type === "push" && trigger.payload?.ab_uri) {
  //     deepLink = trigger.payload.ab_uri.toString();
  //   }

  if (trigger.type === "push") {
    if (displayJson) {
      const display = JSON.parse(displayJson);
      content = display.internal_body;
      deepLink = display.action;
      internalImage = display.internal_icon_path;
    }

    if (trigger.payload?.type) {
      type = trigger.payload.type as string;
    }
  }

  return { deepLink, content, internalImage, type, raw: message };
};

export interface ExpoNotificationResponse {
  notification: {
    request: {
      trigger: NotificationTrigger;
    };
  };
}

export const parseExpoNotificationResponse = (
  response: ExpoNotificationResponse,
) => {
  let deepLink = "";
  const trigger = response.notification.request.trigger;
  const type = trigger?.payload?.type;
  const displayJson = trigger?.payload?.display;
  if (trigger.type === "push" && displayJson) {
    const data = JSON.parse(displayJson);
    deepLink = data.action;
  }
  return { deepLink, type, raw: response };
};
