import defaultAvatar from "@assets/default_avatar.png";

export const avatarErrorHandler = ({
  currentTarget,
}: {
  currentTarget: HTMLImageElement;
}) => {
  currentTarget.onerror = null;
  currentTarget.src = defaultAvatar;
};
