// import { Image, Note, PhoneCall, VideoCamera } from "phosphor-react";
import { Group } from "@app/models/group";
import { Message } from "@app/models/message";
import { User } from "@app/models/user";
import { Bubble } from "@pages/home/components/Bubble/Bubble";
import { BsCameraVideo, BsCardImage, BsJournalText } from "react-icons/bs";
import { FiPhoneCall } from "react-icons/fi";

interface DiscussionPanelProps {
  mate: User | Group;
  messages: Message[];
}

export function DiscussionPanel({ mate, messages }: DiscussionPanelProps) {
  const empty = messages.length === 0;
  return empty ? (
    <div className="flex flex-1 hakkunde">
      Please open a discussion to start chatting
    </div>
  ) : (
    <div
      id="discussion-panel"
      className="flex flex-col flex-1 bg-white border-r-1 border-gray-300 justify-start items-start">
      <div className="px-6 py-8 flex justify-between w-full border-b-1 border-gray-300">
        <h6 className="font-semibold text-gray-600">Chris Pratt</h6>
        <div className="flex text-2xl text-gray-400 gap-4">
          <BsCameraVideo />
          <FiPhoneCall />
          <BsCardImage />
          <BsJournalText />
        </div>
      </div>

      <div className="py-4 px-6 flex hw-full">
        <Bubble />
      </div>
    </div>
  );
}
