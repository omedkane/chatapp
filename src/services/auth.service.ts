import { User, UserEntity } from "@app/models/user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import authHelper from "./helpers/auth.helper";
import { server } from "@app/configs/server.config";

interface UserRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthAPI = createApi({
  reducerPath: "auth-api",
  baseQuery: fetchBaseQuery({ baseUrl: server.baseUrl }),
  endpoints: (builder) => ({
    signUp: builder.mutation<{ message: string }, UserRequestBody>({
      query: (user: UserRequestBody) => ({
        url: server.endpoints.users.base,
        method: "POST",
        body: user,
      }),
    }),
    signIn: builder.query<User, { email: string; password: string }>({
      query: (userCredentials) => ({
        url: server.endpoints.auth.signIn,
        method: "POST",
        body: userCredentials,
      }),
      transformResponse: (response: {
        token: string;
        user: {
          id: string;
          avatar: string;
          firstName: string;
          lastName: string;
        };
      }) => {
        authHelper.authenticate(response.token);

        const user = response.user;
        return UserEntity.toModel({
          id: user.id,
          avatarURI: user.avatar,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      },
    }),
    setUserAvatar: builder.mutation<any, { id: string; avatar: File }>({
      query: ({ id, avatar }) => {
        const authorization = authHelper.isAuthenticated();
        const body = new FormData();

        body.append("id", id);
        body.append("avatar", avatar);

        if (typeof authorization !== "string")
          throw Error("You're not authorized to perform such actions !");

        return {
          url: server.endpoints.users.avatar(id),
          method: "POST",
          body,
          headers: {
            Authorization: `Bearer ${authorization}`,
          },
        };
      },
    }),
    logout: builder.query({
      query: () => ({
        method: "GET",
        url: "logout",
      }),
    }),
  }),
});

export default AuthAPI;
