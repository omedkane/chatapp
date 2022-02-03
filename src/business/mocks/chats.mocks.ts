import { Chat, ChatEntity } from "@business/models/chat";
import { message_mocks } from "./messages.mocks";
import user_mocks from "./users.mocks";

const toModel = ChatEntity.toModel;

const chat_mocks: Chat[] = [
  toModel({
    id: "faae3617-3929-5ec0-a270-ef23c139537c",
    mate: user_mocks[1],
    messages: message_mocks.slice(0, 5),
  }),
  toModel({
    id: "43baa61f-6de0-5790-8278-9ec39f2ca445",
    mate: user_mocks[3],
    messages: message_mocks.slice(5, 11),
  }),
];

export default chat_mocks;
