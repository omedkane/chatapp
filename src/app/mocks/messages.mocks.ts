import { MessageType } from "@app/enums/messages.enum";
import { Message, MessageEntity } from "@app/models/message";
import user_mocks from "./users.mocks";

const toModel = MessageEntity.toModel;

export const message_mocks: Message[] = [
  toModel({
    id: "82cb65d6-4f37-58c1-b5ca-4549bb33eb00",
    type: MessageType.Text,
    sender: user_mocks[1].id,
    receiver: user_mocks[0].id,
    dateSent: new Date("01/15/2022 15:21").getTime(),
    text: "Sup, where are you ?",
    isRead: true,
  }),
  toModel({
    id: "0006f7ce-b139-57c7-b4ee-b0b1250402f8",
    type: MessageType.Text,
    sender: user_mocks[0].id,
    receiver: user_mocks[1].id,
    dateSent: new Date("01/15/2022 15:22").getTime(),
    text: "Hey, yeah I'm at home, sup ?",
    isRead: true,
  }),
  toModel({
    id: "9a9001c9-fb93-5863-b5a1-74325cafb8ac",
    type: MessageType.Text,
    sender: user_mocks[1].id,
    receiver: user_mocks[0].id,
    dateSent: new Date("01/15/2022 15:23").getTime(),
    text: "Can we watch the game, there ?",
    isRead: true,
  }),
  toModel({
    id: "170c8a0b-9e0c-5ce3-b04e-80aca14c4a35",
    type: MessageType.Text,
    sender: user_mocks[0].id,
    receiver: user_mocks[1].id,
    dateSent: new Date("01/15/2022 15:24").getTime(),
    text: "Sure doin' so as we speak, come on right up",
    isRead: true,
  }),
  toModel({
    id: "6078dadc-8cb9-5cf4-8737-57963e6dbd4b",
    type: MessageType.Text,
    sender: user_mocks[1].id,
    receiver: user_mocks[0].id,
    dateSent: new Date("01/15/2022 15:25").getTime(),
    text: "Cool, I'm on my way",
    isRead: false,
  }),

  // ! Chat number 2

  toModel({
    id: "964693be-a211-5333-8124-e9d7a850bd20",
    type: MessageType.Text,
    sender: user_mocks[1].id,
    receiver: user_mocks[3].id,
    dateSent: new Date("01/15/2022 15:42").getTime(),
    text: "Hey Uthman, how are you ? it's Omar I'm using Tori's phone",
    isRead: true,
  }),
  toModel({
    id: "9f2f2ed0-8f6e-5550-b837-f23d2038f6e4",
    type: MessageType.Text,
    sender: user_mocks[1].id,
    receiver: user_mocks[3].id,
    dateSent: new Date("01/15/2022 15:43").getTime(),
    text: "Oh Hey Umar, I'm fine what about you ?",
    isRead: true,
  }),
  toModel({
    id: "e44cfd84-668f-5289-bd67-76e1fb42c43c",
    type: MessageType.Text,
    sender: user_mocks[1].id,
    receiver: user_mocks[3].id,
    dateSent: new Date("01/15/2022 15:44").getTime(),
    text: "I'm alright thanks, have you decided on the wedding plan yet ?",
    isRead: true,
  }),
  toModel({
    id: "e205894c-c001-557d-bfbc-18c1c82589ae",
    type: MessageType.Text,
    sender: user_mocks[1].id,
    receiver: user_mocks[3].id,
    dateSent: new Date("01/15/2022 15:45").getTime(),
    text: "Nope not yet, my fiancée is undecisive, you know how women are 😂",
    isRead: true,
  }),
  toModel({
    id: "eb257f96-3522-5b2c-8384-9531c7a71b49",
    type: MessageType.Text,
    sender: user_mocks[1].id,
    receiver: user_mocks[3].id,
    dateSent: new Date("01/15/2022 15:46").getTime(),
    text: "Tell me about it, my wife drove me mad, I'm glad I got through it in one piece 😂",
    isRead: true,
  }),
  toModel({
    id: "6546978a-562c-52a6-a58f-e09ca5182669",
    type: MessageType.Text,
    sender: user_mocks[1].id,
    receiver: user_mocks[3].id,
    dateSent: new Date("01/15/2022 15:47").getTime(),
    text: "😂😂😂",
    isRead: true,
  }),
];
