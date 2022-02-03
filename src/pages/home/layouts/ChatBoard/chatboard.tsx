import { Chat } from "@business/models/chat";
import { User } from "@business/models/user";
import { Avatar } from "@pages/home/components/avatar/avatar";
import { ChatBox } from "@pages/home/components/chatbox/chatbox";
import { FaRegStar } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { RiArrowDropDownLine, RiEditCircleLine } from "react-icons/ri";

type LayoutProps = {
  currentUser: User;
  onlineFriends: User[];
  chats: Chat[];
};

export function ChatBoard({ currentUser, onlineFriends, chats }: LayoutProps) {
  return (
    <div id="middle-panel">
      <div className="flex flex-col w-full px-4">
        <div id="current-user" className="py-6 border-b-2 border-gray-200">
          <div className="flex justify-start">
            <div id="current-user-avatar" className="mr-4">
              <img
                src={currentUser.avatarUri}
                className="gShaded"
                alt="Current User Profile Avatar"
              />
            </div>
            <div>
              <h5 className="mt-2 font-medium">{currentUser.fullName}</h5>
              <span className="text-gray-500 font-medium text-sm">
                My Account
              </span>
            </div>
          </div>
        </div>

        <div id="available-friends" className="mt-4 w-full">
          <div className="flex w-full justify-between">
            <span className="font-semibold">Online Now</span>
            <span className="text-blue-600 font-bold text-sm">10</span>
          </div>

          <div className="flex w-full pt-3">
            {onlineFriends.map((friend, index) => (
              <Avatar
                uri={friend.avatarUri}
                key={index}
                className="mr-6"></Avatar>
            ))}
          </div>
        </div>
      </div>
      <div id="last-chats" className="mt-6 flex flex-col w-full">
        <div className="flex justify-between px-4">
          <div className="flex">
            <span className="font-semibold">Messages</span>
            <RiArrowDropDownLine className="text-3xl" />
          </div>
          <div className="flex">
            <RiEditCircleLine className="text-gray-400 text-2xl mr-2" />
            <FaRegStar className="text-gray-400 text-2xl" />
          </div>
        </div>

        <div className="search-box mt-4 mx-4">
          <FiSearch className="search-icon" />
          <input type="text" placeholder="Search a message or a contact" />
        </div>
        <div className="mt-2 flex flex-col hw-full">
          {chats.map((chat, index) => (
            <ChatBox key={index} chat={chat}></ChatBox>
          ))}
        </div>
      </div>
    </div>
  );
}
