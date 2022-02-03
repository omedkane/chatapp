import "./avatar.scss";
import defaultAvatar from "@assets/default_avatar.png";

interface AvatarProps {
  className?: string;
  uri?: string;
}
export function Avatar({ className = "", uri }: AvatarProps) {
  return (
    <div className={className + " avatar gShaded"}>
      <img src={uri || defaultAvatar} alt="Friend's avatar" />
      <div className="online-indicator gShaded"></div>
    </div>
  );
}
