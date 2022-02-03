import user_mocks from "@business/mocks/users.mocks";
import { User } from "@business/models/user";
import { ApiResponse } from "./service.types";

interface IFriendService {
  readonly getFriends: (user: User) => Promise<ApiResponse<User[]>>;
}
const FriendService: IFriendService = {
  getFriends: async (user: User) => {
    return new Promise<ApiResponse<User[]>>((resolve) => {
      setTimeout(() => {
        const friends = user_mocks.filter((_user) => _user.id !== user.id);
        resolve(new ApiResponse(friends));
      }, 500);
    });
  },
};

export default FriendService;
