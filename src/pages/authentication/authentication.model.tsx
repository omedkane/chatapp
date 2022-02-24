import { useState } from "react";
import AuthAPI from "../../services/auth.service";
import { FailureModal } from "../../ui/components/Modal/common/failure.modal";
import { InfoModal } from "../../ui/components/Modal/common/info.modal";
import { LoadingModal } from "../../ui/components/Modal/common/loading.modal";
import { SuccessModal } from "../../ui/components/Modal/common/success.modal";
import { useModal } from "../../ui/components/Modal/Modal";
import { useForm } from "../../ui/components/PandaInput/PandaForm";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import { doesExist } from "@core/functions/misc";

type SignUpForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
export function useAuthenticationScreenModel() {
  const navigate = useNavigate();

  const [signUp] = AuthAPI.useSignUpMutation();
  const [signIn] = AuthAPI.useLazySignInQuery();

  const [isLogin, setIsLogin] = useState(false);
  const [hasSignedUp, setHasSignedUp] = useState(false);

  const { Modal, openModal, closeModal } = useModal();

  const { PandaInput, formController, form } = useForm<SignUpForm>({
    fields: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
    },
    validators: {
      email: {
        message: "Please type in a correct email address !",
        validator: (text) => {
          return validator.isEmail(text);
        },
      },
      password: {
        message: "Your password must be more than 6 characters !",
        validator: (pass) => {
          return pass.length > 6;
        },
      },
      firstName: {
        message: "Your first name is too short !",
        validator: (firstName) => {
          return firstName.length > 1;
        },
      },
      lastName: {
        message: "Your last name is too short !",
        validator: (lastName) => {
          return lastName.length > 1;
        },
      },
    },
    onSubmit: () => {
      if (isLogin) _signIn();
      else _signUp();
    },
  });

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

  const submit = () => {
    formController.validate({
      targetFields: isLogin ? ["email", "password"] : undefined,
      onValidationError: (message) => {
        openModal({
          child: <FailureModal message={message} />,
        });
      },
      onSuccess: () => {
        if (isLogin) _signIn();
        else _signUp();
      },
    });
  };

  const _signUp = async () => {
    openModal({
      child: <LoadingModal message="Creating user..." />,
      closeable: false,
    });
    setTimeout(() => {
      signUp({
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

  const _signIn = async () => {
    openModal({
      child: <LoadingModal message="Logging you in..." />,
      closeable: false,
    });
    setTimeout(() => {
      signIn({
        email: form.email,
        password: form.password,
      })
        .unwrap()
        .then((data) => {
          console.log(data);

          closeModal({
            callback: () => {
              openModal({
                child: (
                  <SuccessModal message="Logged In !, You'll be redirected shortly..." />
                ),
                closeable: false,
              });
              setTimeout(() => {
                if (!doesExist(data.avatarURI)) {
                  navigate("/avatar", { replace: true });
                } else {
                  navigate("/", { replace: true });
                }
              }, 1000);
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
    submit,
    switches: { isLogin, hasSignedUp },
    Modal,
    switchForm,
    PandaInput,
  };
}
