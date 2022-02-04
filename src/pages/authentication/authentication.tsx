import "./authentication.scss";
import { createContext } from "react";
import { useForm } from "../../ui/components/PandaInput/PandaForm";

interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export function AuthenticationScreen() {
  const fieldMap: SignUpForm = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  };
  const context = createContext<SignUpForm>(fieldMap);

  const { PandaForm, PandaInput } = useForm<SignUpForm>(context);
  // const [signUp, result] = AuthAPI.useLoginMutation({});
  // const useForm = () => {
  //   return PandaInput;
  // }
  return (
    <div
      id="authentication-screen"
      className="flex flex-col hw-full px-5 lg:px-8">
      <div
        className="flex justify-start items-start"
        style={{ gridArea: "header" }}>
        <div className="flex w-full items-center py-6">
          <div className="h-10 w-10 radius-1/2 bg-blue-800"></div>
          <h4 className="font-semibold text-white pl-4">ChatApp</h4>
        </div>
      </div>

      <div
        id="herd-1"
        className="flex flex-col portrait:mt-8 lg:mt-12 portrait:gap-3"
        style={{ gridArea: "greet" }}>
        <h6 className="font-semibold text-gray-300">START FOR FREE</h6>
        <h3 className="my-2 font-semibold">Create a new account</h3>
        <span className="text-gray-300">
          Already a member ? <span className="text-blue-800 pl-2">Login</span>
        </span>
      </div>

      <PandaForm fieldMap={fieldMap}>
        <div
          className="input-group mt-6 flex flex-col gap-x-0 place-items-center lg:justify-start lg:items-start w-full portrait:mt-12"
          style={{ gridArea: "form" }}>
          <div id="basic-info-form" className="flex gap-4">
            <PandaInput
              name="firstName"
              className=" md:w-48"
              title="First name"
              type="basic-info"
            />
            <PandaInput
              name="lastName"
              className=" md:w-48"
              title="Last name"
              type="basic-info"
            />
          </div>
          <div
            id="auth-inputs"
            className="mt-6 flex flex-col w-full lg:w-1/2 gap-6 md:gap-6">
            <PandaInput name="email" title="Email" type="email" />
            <PandaInput name="password" title="Password" type="password" />
          </div>
          <button
            onClick={() => {
              console.log(fieldMap);
            }}
            id="submit-button"
            className="mt-6 lg:mt-12 flex hakkunde rounded-full active:outline-none px-10 py-4">
            Sign Up
          </button>
        </div>
      </PandaForm>
    </div>
  );
}
