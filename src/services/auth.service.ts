import user_mocks from "@business/mocks/users.mocks";
import { User, UserEntity } from "@business/models/user";
import { ApiResponse } from "./service.types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface IAuthService {
  readonly login: () => Promise<ApiResponse<User>>;
}

export const AuthService: IAuthService = {
  login: async () => {
    return new Promise<ApiResponse<User>>((resolve) =>
      setTimeout(() => {
        const user = user_mocks[0];
        console.log(user_mocks);

        resolve(new ApiResponse(user));
      }, 500)
    );
  },
};

const AuthAPI = createApi({
  reducerPath: "rtkAuth",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/auth" }),
  endpoints: (builder) => ({
    login: builder.mutation<User, Partial<User> & Pick<User, "id">>({
      query: (user: User) => ({
        url: "auth",
        method: "POST",
        body: user,
      }),
      transformResponse: (response) => {
        const res = response as {
          id: string;
          avatar: string;
          firstName: string;
          lastName: string;
        };
        return UserEntity.toModel({
          id: res.id,
          avatarUri: res.avatar,
          firstName: res.firstName,
          lastName: res.lastName,
        });
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
