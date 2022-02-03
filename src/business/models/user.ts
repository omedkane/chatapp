interface UserWithoutGetters {
  id: string;
  firstName: string;
  lastName: string;
  avatarUri: string;
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
    avatarUri: user.avatarUri,
  });
}
