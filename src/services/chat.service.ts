import chat_mocks from "@business/mocks/chats.mocks";
import { Chat } from "@business/models/chat";
import { User } from "@business/models/user";
import { ApiResponse } from "./service.types";

interface IChatService {
  readonly getLastChats: (currentUser: User) => Promise<ApiResponse<Chat[]>>;
}

const ChatService: IChatService = {
  getLastChats: (currentUser: User) => {
    return new Promise<ApiResponse<Chat[]>>((resolve) => {
      setTimeout(() => {
        resolve(new ApiResponse(chat_mocks));
      }, 500);
    });
  },
};

export default ChatService;
