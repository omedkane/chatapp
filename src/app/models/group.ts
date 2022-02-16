import { Message } from "./message";
import { User } from "./user";

interface GroupWithoutGetters {
  id: string;
  members: User[];
  dateCreated: Date;
  administrator: User;
  messages: Message[];
}
export interface Group extends GroupWithoutGetters {}

export abstract class GroupEntity {
  static toModel = (group: GroupWithoutGetters): Group => {
    return {
      id: group.id,
      members: group.members,
      dateCreated: group.dateCreated,
      administrator: group.administrator,
      messages: group.messages,
    };
  };
}
