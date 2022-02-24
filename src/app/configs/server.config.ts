export const server = {
  baseUrl: "http://localhost:4000",
  links: {
    getAvatarURI: (userID: string) =>
      `${server.baseUrl}/api/users/${userID}/avatar`,
  },
  endpoints: {
    auth: {
      signIn: "auth/signin",
    },
    users: {
      base: "api/users",
      withID: function (this, userID: string) {
        return `${this.base}/${userID}`;
      },
      avatar: function (this, userID: string) {
        return this.withID(userID) + "avatar";
      },
    },
    chats: "api/chats",
    messages: "api/messages",
    groups: "api/groups",
  },
};
