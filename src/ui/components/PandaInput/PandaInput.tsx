import "./PandaInput.scss";
import {
  ComponentType,
  CSSProperties,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiOutlineEye } from "react-icons/ai";
import { HiMail } from "react-icons/hi";
import { FaUserEdit } from "react-icons/fa";
// @ts-ignore
import { Subject } from "rxjs";
import { ControlNotification } from "./PandaForm";
import { EventHelper } from "@core/helpers/event.helper";

interface PandaInputProps<T = any> {
  name: Extract<keyof T, string>;
  title: string;
  type: "email" | "info" | "password";
  className?: string;
  remotelyDisabled?: boolean;
  onDisabled?: () => void;
  onEnabled?: () => void;
}
const enum PandaStatus {
  Vanishing,
  Vanished,
  Appearing,
  Appeared,
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
  setField: (field: string, value: string | number) => void,
  subject: Subject<ControlNotification>
) {
  function PandaInput({
    name,
    title,
    type,
    className = "",
    remotelyDisabled,
    onDisabled,
    onEnabled,
  }: PandaInputProps<Form>) {
    console.log(`PandaInput Rerender ${name}`);
    const InputIcon = InputIcons[type];

    const [isFilled, setIsFilled] = useState(false);
    const setForm = (value: string) => setField(name, value);

    const [animationProps, setAnimationProps] = useState({
      status: PandaStatus.Appeared,
      savedWidth: "0",
      savedMargin: "0",
      classes: "",
      style: {
        "--panda-width": "0px",
      } as CSSProperties,
    });
    // * Refs
    const inputRef = useRef<HTMLInputElement>(null);
    const pandaInputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (inputRef.current !== null) setForm(inputRef.current.value);
    });

    useEffect(() => {
      if (remotelyDisabled && animationProps.status === PandaStatus.Appeared) {
        disableMe();
      } else if (
        !remotelyDisabled &&
        animationProps.status === PandaStatus.Vanished
      ) {
        enableMe();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remotelyDisabled]);

    const onChange = (element: React.ChangeEvent<HTMLInputElement>) => {
      const value = element.target.value;
      setForm(value);

      if (value !== "") {
        setIsFilled(true);
      } else setIsFilled(false);
    };

    const isAnimating = () =>
      [PandaStatus.Appearing, PandaStatus.Vanishing].includes(
        animationProps.status
      );

    const disableMe = (callback?: () => void) => {
      if (
        animationProps.status === PandaStatus.Vanished ||
        isAnimating() ||
        pandaInputRef.current === null
      )
        return;

      const { width: _currentWidth, margin: _currentMargin } =
        globalThis.getComputedStyle(pandaInputRef.current);

      setAnimationProps({
        ...animationProps,
        classes: "vanishing",
      });

      if (pandaInputRef.current === null) return;

      EventHelper.setAnimationEndCallback(
        pandaInputRef.current,
        "vanish-panda",
        (event) => {
          if (_currentWidth) {
            setAnimationProps({
              ...animationProps,
              savedWidth: _currentWidth,
              savedMargin: _currentMargin,
              status: PandaStatus.Vanished,
              classes: "vanished",
            });

            globalThis.requestAnimationFrame(() => {
              if (onDisabled !== undefined) onDisabled();
              if (callback !== undefined) callback();
            });
          }
        }
      );
    };

    const enableMe = (callback?: () => void) => {
      if (animationProps.status === PandaStatus.Appeared || isAnimating())
        return;

      setAnimationProps({
        ...animationProps,
        status: PandaStatus.Appearing,
        classes: "vanished appearing",
        style: {
          "--panda-width": animationProps.savedWidth,
          "--panda-margin": animationProps.savedMargin,
        } as CSSProperties,
      });

      requestAnimationFrame(() => {
        if (pandaInputRef.current === null) return;

        EventHelper.setAnimationEndCallback(
          pandaInputRef.current,
          "show-input-box",
          (event) => {
            setAnimationProps({
              ...animationProps,
              status: PandaStatus.Appeared,
              classes: "",
              style: {},
            });
            globalThis.requestAnimationFrame(() => {
              if (onEnabled !== undefined) onEnabled();
              if (callback !== undefined) callback();
            });
          }
        );
      });
    };
    const switchMe = (callback?: () => void) => {
      if (isAnimating()) return;

      if (animationProps.status === PandaStatus.Appeared) disableMe(callback);
      else if (animationProps.status === PandaStatus.Vanished)
        enableMe(callback);
    };

    useEffect(() => {
      const subscription = subject.subscribe(
        (notification: ControlNotification) => {
          if (notification.field !== name) return;

          switch (notification.operation) {
            case "disable":
              disableMe(notification.callback);
              break;
            case "enable":
              enableMe(notification.callback);
              break;
            case "switch":
              switchMe(notification.callback);
              break;
          }
        }
      );
      return () => {
        subscription.unsubscribe();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    return animationProps.status === PandaStatus.Vanished ? (
      <Fragment />
    ) : (
      <div
        ref={pandaInputRef}
        style={animationProps.style}
        className={`PandaInput flex rounded-xl h-16 w-full hakkunde ${className} ${animationProps.classes}`}>
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
