import { AnimatedSize } from "../../ui/components/AnimatedSize/AnimatedSize";
import { useAuthenticationScreenModel } from "./authentication.model";
import "./authentication.scss";

export function AuthenticationScreen() {
  const { switches, switchForm, Modal, PandaInput, submit } =
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
          <h4 className="font-semibold text-white pl-4 mr-6">ChatApp</h4>
        </div>
      </div>

      <div
        id="herd-1"
        className="flex flex-col portrait:mt-8 lg:mt-12 portrait:gap-3"
        style={{ gridArea: "greet" }}>
        <AnimatedSize>
          {switches.hasSignedUp || switches.isLogin ? (
            <h6 key={54} className="font-semibold text-gray-300">
              LOGIN TO START
            </h6>
          ) : (
            <h6 key={55} className="font-semibold text-gray-300">
              START FOR FREE
            </h6>
          )}
        </AnimatedSize>
        <AnimatedSize>
          {switches.hasSignedUp ? (
            <h3 key={57} className="my-2 font-semibold">
              Your account has been created !
            </h3>
          ) : switches.isLogin ? (
            <h3 key={56} className="my-2 font-semibold">
              Please login to your account
            </h3>
          ) : (
            <h3 key={58} className="my-2 font-semibold">
              Create a new account
            </h3>
          )}
        </AnimatedSize>
        <span className="text-gray-300">
          {switches.isLogin ? "Don't have an account" : "Already a member ?"}
          <span
            className="font-bold text-blue-800 pl-2 cursor-pointer select-none"
            onClick={() => switchForm()}>
            {switches.isLogin ? "Sign Up" : "Login"}
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
          />
          <PandaInput
            name="lastName"
            className="md:w-48"
            title="Last name"
            type="info"
          />
        </div>
        <div
          id="auth-inputs"
          className={`${
            !switches.isLogin ? "mt-6" : ""
          } transition-spacing  flex flex-col w-full lg:w-1/2 gap-6 md:gap-6`}>
          <PandaInput name="email" title="Email" type="email" />
          <PandaInput name="password" title="Password" type="password" />
        </div>
        <button
          onClick={submit}
          id="submit-button"
          className="mt-6 lg:mt-12 panda-button blue">
          {switches.isLogin ? "Sign in" : "Sign Up"}
        </button>
      </div>
    </div>
  );
}
