import { useAuthenticationScreenModel } from "./authentication.model";
import "./authentication.scss";

export function AuthenticationScreen() {
  const { Modal, PandaInput, isLogin, switchForm, signUp } =
    useAuthenticationScreenModel();
  return (
    <div
      id="authentication-screen"
      className="flex flex-col hw-full px-5 lg:px-8">
      <Modal></Modal>
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
          {isLogin ? "Don't have an account" : "Already a member ?"}
          <span
            className="font-bold text-blue-800 pl-2 cursor-pointer"
            onClick={() => switchForm()}>
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </span>
      </div>

      <div
        className="input-group mt-6 flex flex-col gap-x-0 place-items-center lg:justify-start lg:items-start w-full portrait:mt-12"
        style={{ gridArea: "form" }}>
        <div id="basic-info-form" className="flex">
          <PandaInput
            name="firstName"
            className="md:w-48 mr-4"
            title="First name"
            type="info"
            remotelyDisabled={isLogin}
          />
          <PandaInput
            name="lastName"
            className="md:w-48"
            title="Last name"
            type="info"
            remotelyDisabled={isLogin}
          />
        </div>
        <div
          id="auth-inputs"
          className={`${
            !isLogin ? "mt-6" : ""
          } transition-spacing  flex flex-col w-full lg:w-1/2 gap-6 md:gap-6`}>
          <PandaInput name="email" title="Email" type="email" />
          <PandaInput name="password" title="Password" type="password" />
        </div>
        <button
          onClick={() => {
            signUp();
            // if(result)
            // console.log(payload);
          }}
          id="submit-button"
          className="mt-6 lg:mt-12 flex hakkunde rounded-full active:outline-none px-10 py-4">
          Sign Up
        </button>
      </div>
    </div>
  );
}
