import { RootState } from "@app/store";
import { Chat } from "@app/models/chat";
import { User } from "@app/models/user";
import { createSlice } from "@reduxjs/toolkit";
import AuthAPI from "../../services/auth.service";
import { server } from "@app/configs/server.config";

const localStorageKey = "chatapp/user";

const getCachedUser = () => {
  const _cachedUser = localStorage.getItem(localStorageKey);

  if (_cachedUser === null && window.location.pathname !== "/auth") {
    window.location.replace("auth");
  }

  return _cachedUser ? JSON.parse(_cachedUser) : null;
};

const updateCachedUser = (user: User) => {
  localStorage.removeItem("chatapp/user");
  localStorage.setItem("chatapp/user", JSON.stringify(user));
};

const cachedUser = getCachedUser();

interface AuthState {
  isLoggedIn: boolean;
  user: User;
  onlineFriends: User[];
  chats: Chat[];
}

console.log(cachedUser);

const initialState: AuthState = {
  isLoggedIn: cachedUser ? true : false,
  user: cachedUser,
  onlineFriends: [],
  chats: [],
};

const authSlice = createSlice({
  name: "loggedUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      AuthAPI.endpoints.signIn.matchFulfilled,
      (state, action) => {
        const user = action.payload;
        user.avatarURI = server.links.getAvatarURI(user.id);

        updateCachedUser(user);

        state.user = user;
      }
    );

    builder.addMatcher(
      AuthAPI.endpoints.setUserAvatar.matchFulfilled,
      (state) => {
        state.user.avatarURI = server.links.getAvatarURI(state.user.id);
        updateCachedUser(state.user);
      }
    );
  },
});

const selectCurrentUser = (state: RootState): User => state.auth.user!;
const selectOnlineFriends = (state: RootState): User[] =>
  state.auth.onlineFriends!;
const selectChats = (state: RootState): Chat[] => state.auth.chats;

export { selectChats, selectCurrentUser, selectOnlineFriends };
export default authSlice.reducer;
