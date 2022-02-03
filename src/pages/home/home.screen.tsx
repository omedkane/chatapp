import "./home.scss";
import { Sidebar } from "./layouts/Sidebar/sidebar";
import useHomeModel from "./home.model";
import Spinner from "react-spinkit";
import { ChatBoard } from "./layouts/ChatBoard/chatboard";
import { DiscussionPanel } from "./layouts/DiscussionPanel/DiscussionPanel";
import { ChatInfo } from "./layouts/ChatInfo/chatinfo";
import { message_mocks } from "@business/mocks/messages.mocks";

export function Home() {
  const { isLoading, currentUser, onlineFriends, chats } = useHomeModel();

  return isLoading ? (
    <div className="flex hw-full hakkunde">
      <Spinner name="cube-grid" color="aqua" />
    </div>
  ) : (
    <div id="home-screen" className="flex h-full w-full">
      <Sidebar />
      <ChatBoard
        currentUser={currentUser}
        onlineFriends={onlineFriends}
        chats={chats}
      />
      <DiscussionPanel mate={onlineFriends[0]} messages={message_mocks}/>
      <ChatInfo/>
    </div>
  );
}
