import { User, UserEntity } from "@business/models/user";
import avatar0 from "../../assets/avatar0.jpg";
import avatar1 from "../../assets/avatar1.jpg";
import avatar2 from "../../assets/avatar2.jpg";
import avatar3 from "../../assets/avatar3.jpg";

const toModel = UserEntity.toModel;

const user_mocks: User[] = [
  toModel({
    id: "810e3083-01bc-5cb4-828a-59022c619d1c",
    firstName: "Stefan",
    lastName: "Salvatore",
    avatarUri: avatar0,
  }),
  toModel({
    id: "caaaa379-d4a5-5e6c-a954-e952ce881c38",
    firstName: "Chris",
    lastName: "Pratt",
    avatarUri: avatar1,
  }),
  toModel({
    id: "108822ac-1490-500d-b7f2-c4d701c55493",
    firstName: "Jennifer",
    lastName: "Lawrence",
    avatarUri: avatar2,
  }),
  toModel({
    id: "fc242907-cdf6-5842-8d13-d23c74ec313c",
    firstName: "Joseph",
    lastName: "Morgan",
    avatarUri: avatar3,
  }),
];

export default user_mocks;
