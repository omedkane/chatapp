import { Chat } from "@business/models/chat";
import { User } from "@business/models/user";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthService } from "../../services/auth.service";
import ChatService from "../../services/chat.service";
import FriendService from "../../services/friend.service";

type LoginResponse = { user: User; chats: Chat[]; onlineFriends: User[] };

const auth = {
  login: createAsyncThunk<LoginResponse, void>(
    "auth/login",
    async (_, { rejectWithValue }) => {
      try {
        const { data: user } = await AuthService.login();
        const { data: chats } = await ChatService.getLastChats(user);
        const { data: onlineFriends } = await FriendService.getFriends(user);

        console.log("loginin");

        return { user, chats, onlineFriends };
      } catch (error) {
        return rejectWithValue("An error occured while fetching chats");
      }
    }
  ),
};

export default auth;
