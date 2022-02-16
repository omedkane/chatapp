import { Message } from "./message";
import { User } from "./user";

interface ChatWithoutGetters {
  id: String;
  mate: User;
  messages: Message[];
}

export interface Chat extends ChatWithoutGetters {
  lastMessage: Message;
  unreadMessages: number;
}

export abstract class ChatEntity {
  static toModel = (chat: ChatWithoutGetters): Chat => {
    const getLastMessage = (): Message => {
      const lastMessageIndex = chat.messages.length - 1;
      return chat.messages[lastMessageIndex];
    };
    const countUnreadMessages = (): number => {
      return chat.messages.filter((message) => !message.isRead).length;
    };
    return {
      id: chat.id,
      lastMessage: getLastMessage(),
      messages: chat.messages,
      mate: chat.mate,
      unreadMessages: countUnreadMessages(),
    };
  };
}
