import "./PandaInput.scss";
import { Context, ReactElement, useContext, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { HiMail } from "react-icons/hi";
import { FaUserEdit } from "react-icons/fa";

interface PandaInputProps<T> {
  name: keyof T;
  title: string;
  type: "email" | "basic-info" | "password";
  className?: string;
}

export function usePandaInput<Form>(FormContext: Context<Form>) {
  function PandaInput({
    name,
    title,
    type,
    className = "",
  }: PandaInputProps<Form>) {
    console.log(`PandaInput Rerender ${name}`);

    const [isFilled, setIsFilled] = useState(false);
    const form = useContext(FormContext);

    let InputIcon: () => ReactElement;
    switch (type) {
      case "email":
        InputIcon = () => <HiMail size={24} />;
        break;
      default:
      case "basic-info":
        InputIcon = () => <FaUserEdit size={24} />;
        break;
      case "password":
        InputIcon = () => <AiOutlineEye size={24} />;
        break;
    }

    function onChange(element: React.ChangeEvent<HTMLInputElement>) {
      const value = element.target.value;

      Object.defineProperty(form, name, { value });

      if (value !== "") {
        setIsFilled(true);
      } else setIsFilled(false);
    }

    return (
      <div className={`PandaInput flex rounded-xl h-16 w-full  ${className}`}>
        <div
          className={`input-box rounded-xl flex flex-col hw-full ${
            isFilled ? "is-filled" : ""
          }`}>
          <span id="input-name" className="text-gray-300">
            {title}
          </span>
          <input
            type="text"
            onChange={onChange}
            className="hw-full bg-transparent autofill:bg-black outline-none placeholder:font-bold"
          />
        </div>
        <div className="h-full flex hakkunde text-gray-300">
          <InputIcon></InputIcon>
        </div>
      </div>
    );
  }

  return PandaInput;
}
