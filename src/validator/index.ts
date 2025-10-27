export interface CheckNotificationToastOpenValidProps {
  pathname: string;
  content: string;
  deepLink?: string;
  image?: string;
  type?: string;
}

export const checkNotificationToastOpenValid = ({
  pathname,
  content,
  deepLink,
  type,
}: CheckNotificationToastOpenValidProps) => {
  if (content.includes("undefined")) {
    return false;
  }

  let shouldShow = !!content;

  const isCurrentChatRoom =
    deepLink?.split("glamapp:/")?.[1] === pathname && type === "chat";
  if (isCurrentChatRoom) {
    shouldShow = false;
  }

  const isOutTogetherScreen = pathname.includes("out-together");
  if (isOutTogetherScreen) {
    shouldShow = false;
  }

  return shouldShow;
};
