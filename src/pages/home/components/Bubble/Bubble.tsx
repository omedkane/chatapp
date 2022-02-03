import { message_mocks } from "@business/mocks/messages.mocks";
import user_mocks from "@business/mocks/users.mocks";
import { Message } from "@business/models/message";
import { User } from "@business/models/user";
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
      <Avatar uri={user.avatarUri} />
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
