import { RootState } from "@app/store";
import { Chat } from "@business/models/chat";
import { User } from "@business/models/user";
import { createSlice } from "@reduxjs/toolkit";
import auth from "../thunks/auth.thunks";

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
    builder.addCase(auth.login.fulfilled, (state, action) => {
      const { user, chats, onlineFriends } = action.payload;
      console.log("It works till here");

      localStorage.setItem("chatapp/user", JSON.stringify(user));

      state.chats = chats;
      state.onlineFriends = onlineFriends;
      state.user = user;

      state.isLoggedIn = true;
    });
  },
});

const selectCurrentUser = (state: RootState): User => state.auth.user!;
const selectOnlineFriends = (state: RootState): User[] => state.auth.onlineFriends!;
const selectChats = (state: RootState): Chat[] => state.auth.chats;

export { selectChats, selectCurrentUser, selectOnlineFriends };
export default authSlice.reducer;
