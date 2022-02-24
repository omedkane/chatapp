import { message_mocks } from "@app/mocks/messages.mocks";
import user_mocks from "@app/mocks/users.mocks";
import { Message } from "@app/models/message";
import { User } from "@app/models/user";
import { Avatar } from "../avatar/avatar";

interface BubbleProps {
  user: User;
  message: Message;
}
export function Bubble() {
  // { user, message }: BubbleProps
  const user = user_mocks[2];
  const message = message_mocks[0];
  return (
    <div className="flex justify-start items-start">
      <Avatar uri={user.avatarURI} />
      <div className="ml-4 flex flex-col">
        <div className="flex">
          <h6 className="font-semibold">{user.fullName}</h6>
          <span className="ml-2 text-gray-400 font-medium">1d</span>
        </div>
        <div className="mt-2 px-4 py-2 rounded-lg bg-gray-100">{message.text}</div>
      </div>
    </div>
  );
}
