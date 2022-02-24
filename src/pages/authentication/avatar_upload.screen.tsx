import { useAppSelector } from "@app/hooks";
import { selectCurrentUser } from "@app/slices/auth.slice";
import { Fragment, useState } from "react";
import { BsFillArrowRightCircleFill, BsImageAlt } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Spinner from "react-spinkit";
import AuthAPI from "../../services/auth.service";
import { AnimatedSize } from "../../ui/components/AnimatedSize/AnimatedSize";
import { FailureModal } from "../../ui/components/Modal/common/failure.modal";
import { SuccessModal } from "../../ui/components/Modal/common/success.modal";
import { useModal } from "../../ui/components/Modal/Modal";
import "./avatar_upload.screen.scss";

export function AvatarUploadScreen() {
  const { Modal, openModal } = useModal();

  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState<string>();
  const [imageFile, setImageFile] = useState<File>();
  const [setUserAvatar] = AuthAPI.useSetUserAvatarMutation();
  const currentUser = useAppSelector(selectCurrentUser);

  const navigate = useNavigate();

  const pickFile = () => {
    const reader = new FileReader();
    const hiddenInput = document.createElement("input");

    hiddenInput.type = "file";
    hiddenInput.accept = "image/png, image/jpeg";
    hiddenInput.click();

    hiddenInput.onchange = (event) => {
      const input = event.target as HTMLInputElement;

      if (input.files === null) return;

      const _file = input.files[0];
      setImageFile(_file);

      reader.readAsDataURL(_file);
    };

    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        setImage(reader.result);
      }
    });
  };
  const uploadAvatar = () => {
    if (imageFile === null || imageFile === undefined) return;
    setIsUploading(true);

    setTimeout(() => {
      setUserAvatar({
        id: currentUser.id,
        avatar: imageFile,
      })
        .unwrap()
        .then((response) => {
          openModal({
            child: (
              <SuccessModal message="Avatar has been set successfully ! You'll be redirected soon" />
            ),
            closeable: false,
            callback: () => {
              setTimeout(() => {
                navigate("/home", { replace: true });
              }, 1500);
            },
          });
        })
        .catch((error) => {
          console.log(error);

          openModal({
            child: (
              <FailureModal message="An error occured, please try again later !" />
            ),
          });
        })
        .finally(() => {
          setIsUploading(false);
        });
    }, 3000);
  };

  const hasSetImage = image !== null && image !== undefined;

  return (
    <div id="avatar-upload-screen" className="flex flex-col hw-full hakkunde">
      <Modal />
      <h3 className="font-bold">
        You're almost there, upload your profile picture
      </h3>

      <h5 className="mt-2 text-gray-300">
        Pick your profile from your gallery to get started !
      </h5>

      <div
        id="avatar-uploader"
        onClick={() => pickFile()}
        className={`flex mt-12 hakkunde relative ${
          hasSetImage ? "has-image" : ""
        }`}>
        {hasSetImage ? (
          <Fragment>
            <img
              id="selected-avatar"
              className="hw-full"
              src={image}
              alt="selected avatar"
            />
            <div id="image-picker">
              <BsImageAlt size={48} className="text-gray-400" />
            </div>
          </Fragment>
        ) : (
          <BsImageAlt size={48} className="text-gray-400" />
        )}
      </div>

      <button
        onClick={!hasSetImage ? undefined : () => uploadAvatar()}
        className={`mt-8 panda-button blue with-icon rounded-3xl ${
          !hasSetImage ? "disabled" : ""
        }`}>
        <AnimatedSize>
          {isUploading ? (
            <Spinner key={1} name="cube-grid" color="white" fadeIn="quarter" />
          ) : (
            <div key={2} className="flex">
              Submit
              <BsFillArrowRightCircleFill
                size={20}
                color="white"
                className="ml-2"
              />
            </div>
          )}
        </AnimatedSize>
      </button>
    </div>
  );
}
