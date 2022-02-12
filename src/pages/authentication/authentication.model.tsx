import { useState } from "react";
import AuthAPI from "../../services/auth.service";
import { FailureModal } from "../../ui/components/Modal/common/failure.modal";
import { LoadingModal } from "../../ui/components/Modal/common/loading.modal";
import { SuccessModal } from "../../ui/components/Modal/common/success.modal";
import { useModal } from "../../ui/components/Modal/Modal";
import { useForm } from "../../ui/components/PandaInput/PandaForm";

interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export function useAuthenticationScreenModel() {
  const [signUp] = AuthAPI.useSignUpMutation({});

  const [isLogin, setIsLogin] = useState(false);
  const [hasSignedUp, setHasSignedUp] = useState(false);

  const { Modal, openModal, closeModal } = useModal();

  const { PandaInput, form } = useForm<SignUpForm>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const switchForm = () => {
    if (isLogin) setIsLogin(!isLogin);

    form.notify({
      fields: ["firstName", "lastName"],
      operation: "switch",
      callback: isLogin
        ? undefined
        : () => {
            setIsLogin(!isLogin);
          },
    });
  };

  const _signUp = async () => {
    // openModal(<LoadingModal message="Creating user..." />);
    // setTimeout(async () => {
    //   await signUp({
    //     firstName: form.firstName,
    //     lastName: form.lastName,
    //     email: form.email,
    //     password: form.password,
    //   })
    //     .then(() => {
    //       closeModal(() => {
    //         openModal(
    //           <SuccessModal message="Successfully Registered !" />,
    //           () => {
    //             switchForm();
    setHasSignedUp(!hasSignedUp);
    //           }
    //         );
    //       });
    //     })
    //     .catch(() => {
    //       closeModal(() => {
    //         openModal(<FailureModal message="An error occured !" />);
    //       });
    //     });
    // }, 2000);
  };

  return {
    signUp: _signUp,
    switches: { isLogin, hasSignedUp },
    Modal,
    switchForm,
    PandaInput,
  };
}
