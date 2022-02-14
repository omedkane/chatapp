import { useState } from "react";
import AuthAPI from "../../services/auth.service";
import { FailureModal } from "../../ui/components/Modal/common/failure.modal";
import { InfoModal } from "../../ui/components/Modal/common/info.modal";
import { LoadingModal } from "../../ui/components/Modal/common/loading.modal";
import { SuccessModal } from "../../ui/components/Modal/common/success.modal";
import { useModal } from "../../ui/components/Modal/Modal";
import { useForm } from "../../ui/components/PandaInput/PandaForm";
import validator from "validator";

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

  const { PandaInput, formController, form } = useForm<SignUpForm>(
    {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
    {
      email: (text) => {
        return validator.isEmail(text);
      },
    }
  );

  const switchForm = () => {
    if (isLogin) setIsLogin(!isLogin);

    formController.notify({
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
    openModal({
      child: <LoadingModal message="Creating user..." />,
      closeable: false,
    });
    setTimeout(async () => {
      await signUp({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      })
        .unwrap()
        .then(() => {
          closeModal({
            callback: () => {
              openModal({
                child: <SuccessModal message="Successfully Registered !" />,
                callback: () => {
                  switchForm();
                  setHasSignedUp(!hasSignedUp);
                },
                onClose: () => {
                  openModal({
                    child: (
                      <InfoModal message="Please sign in to your account, to start" />
                    ),
                    onClose: () => {
                      formController.notify({
                        fields: ["*"],
                        operation: "clear",
                      });
                    },
                  });
                },
              });
            },
          });
        })
        .catch((error) => {
          const errorMessage = error.data?.error ?? error.data?.message;

          closeModal({
            callback: () => {
              openModal({ child: <FailureModal message={errorMessage} /> });
            },
          });
        });
    }, 3000);
  };

  return {
    signUp: _signUp,
    switches: { isLogin, hasSignedUp },
    Modal,
    switchForm,
    PandaInput,
  };
}
