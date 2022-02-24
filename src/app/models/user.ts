import { server } from "@app/configs/server.config";

interface UserWithoutGetters {
  id: string;
  firstName: string;
  lastName: string;
  avatarURI: string;
}
export interface User extends UserWithoutGetters {
  fullName: string;
}

export abstract class UserEntity {
  static toModel = (user: UserWithoutGetters): User => ({
    id: user.id,
    firstName: user.firstName,
    fullName: user.firstName + " " + user.lastName,
    lastName: user.lastName,
    avatarURI: server.links.getAvatarURI(user.avatarURI),
  });
}
