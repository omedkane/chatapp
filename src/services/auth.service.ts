import { User, UserEntity } from "@app/models/user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface UserRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthAPI = createApi({
  reducerPath: "rtkAuth",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/" }),
  endpoints: (builder) => ({
    signUp: builder.mutation<{ message: string }, UserRequestBody>({
      query: (user: UserRequestBody) => ({
        url: "api/users",
        method: "POST",
        body: user,
      }),
    }),
    signIn: builder.query<User, { email: string; password: string }>({
      query: (userCredentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: userCredentials,
      }),
      transformResponse: (response) => {
        console.log(response);

        const res = response as {
          user: {
            id: string;
            avatar: string;
            firstName: string;
            lastName: string;
          };
        };
        return UserEntity.toModel({
          id: res.user.id,
          avatarUri: res.user.avatar,
          firstName: res.user.firstName,
          lastName: res.user.lastName,
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
