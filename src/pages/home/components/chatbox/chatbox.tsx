import { Chat } from "@app/models/chat";
import { Avatar } from "../avatar/avatar";
import "./chatbox.scss";

interface ChatBoxProps {
  chat: Chat;
}

export function ChatBox({ chat }: ChatBoxProps) {
  const mate = chat.mate;
  const fullName = mate.firstName + " " + mate.lastName;

  return (
    <div className="chat-box flex cursor-pointer py-4 px-4 items-center">
      <Avatar uri={mate.avatarUri}></Avatar>
      <div className="pl-4 flex flex-col overflow-hidden hw-full">
        <span className="font-semibold">{fullName}</span>
        <span className="text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap">
          {chat.lastMessage.text}
        </span>
      </div>
      {chat.unreadMessages > 0 ? (
        <div className="flex radius-1/2 bg-blue-600 text-white h-6 w-6 hakkunde">
          <small>{chat.unreadMessages}</small>
        </div>
      ) : null}
    </div>
  );
}
