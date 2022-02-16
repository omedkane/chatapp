import { MessageType } from "@app/enums/messages.enum";
import { Group } from "./group";
import { User } from "./user";

interface MessageWithoutGetters {
  id: string;
  type: MessageType;
  text: string;
  sender: string;
  receiver: string | Group;
  dateSent: number;
  isRead: boolean;
}
export interface Message extends MessageWithoutGetters {}

export abstract class MessageEntity {
  static toModel(message: MessageWithoutGetters): Message {
    return {
      id: message.id,
      type: message.type,
      text: message.text,
      sender: message.sender,
      receiver: message.receiver,
      dateSent: message.dateSent,
      isRead: message.isRead,
    };
  }
}
