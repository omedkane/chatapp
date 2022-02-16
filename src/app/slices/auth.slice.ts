import { RootState } from "@app/store";
import { Chat } from "@app/models/chat";
import { User } from "@app/models/user";
import { createSlice } from "@reduxjs/toolkit";
import AuthAPI from "../../services/auth.service";

let storedUser = localStorage.getItem("chatapp/user");
const user = storedUser ? JSON.parse(storedUser) : null;

interface AuthState {
  isLoggedIn: boolean;
  user: User;
  onlineFriends: User[];
  chats: Chat[];
}

const initialState: AuthState = {
  isLoggedIn: user ? true : false,
  user,
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

        localStorage.setItem("chatapp/user", JSON.stringify(user));

        state.user = user;
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
