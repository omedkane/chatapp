import "./PandaInput.scss";
import {
  ComponentType,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiOutlineEye } from "react-icons/ai";
import { HiMail } from "react-icons/hi";
import { FaUserEdit } from "react-icons/fa";

interface PandaInputProps<T = any> {
  name: Extract<keyof T, string>;
  title: string;
  type: "email" | "info" | "password";
  className?: string;
}

type PandaInputIcons = {
  [key in PandaInputProps["type"]]: ComponentType;
};

const InputIcons: PandaInputIcons = {
  email: () => <HiMail size={24} />,
  info: () => <FaUserEdit size={24} />,
  password: () => <AiOutlineEye size={24} />,
};

export function usePandaInput<Form>(
  setField: (field: string, value: string | number) => void
) {
  function PandaInput({
    name,
    title,
    type,
    className = "",
  }: PandaInputProps<Form>) {
    console.log(`PandaInput Rerender ${name}`);
    const InputIcon = InputIcons[type];

    const [isFilled, setIsFilled] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const setForm = (value: string) => setField(name, value);

    useEffect(() => {
      if (inputRef.current !== null) setForm(inputRef.current.value);
    });

    const onChange = (element: React.ChangeEvent<HTMLInputElement>) => {
      const value = element.target.value;
      setForm(value);

      if (value !== "") {
        setIsFilled(true);
      } else setIsFilled(false);
    };

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
            type={type === "password" ? type : "text"}
            onChange={onChange}
            ref={inputRef}
            className="hw-full bg-transparent autofill:bg-black outline-none placeholder:font-bold"
          />
        </div>
        <div className="h-full flex hakkunde text-gray-300">
          <InputIcon />
        </div>
      </div>
    );
  }

  return PandaInput;
}
