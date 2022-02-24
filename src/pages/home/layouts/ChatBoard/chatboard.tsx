import { avatarErrorHandler } from "@app/handlers/errors/avatar.error.handler";
import { Chat } from "@app/models/chat";
import { User } from "@app/models/user";
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
                src={currentUser.avatarURI}
                onError={avatarErrorHandler}
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
            <span className="text-blue-600 font-bold text-sm">
              {onlineFriends.length}
            </span>
          </div>

          <div className="flex w-full pt-3">
            {onlineFriends.length !== 0 ? (
              onlineFriends.map((friend, index) => (
                <Avatar
                  uri={friend.avatarURI}
                  key={index}
                  className="mr-6"></Avatar>
              ))
            ) : (
              <span className="my-4 text-blue-500 text-center">
                You don't have any friends, send invitations !
              </span>
            )}
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
          {chats.length !== 0 ? (
            chats.map((chat, index) => (
              <ChatBox key={index} chat={chat}></ChatBox>
            ))
          ) : (
            <span className="text-blue-500 text-center my-4 mx-8">
              You have not started any conversation yet !
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
