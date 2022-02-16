import "./PandaInput.scss";
import {
  ComponentType,
  CSSProperties,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiOutlineEye } from "react-icons/ai";
import { HiMail } from "react-icons/hi";
import { FaUserEdit } from "react-icons/fa";
// @ts-ignore
import { debounceTime, fromEvent, map, Observable } from "rxjs";
import { ControlNotification, FormController } from "./PandaForm";
import { EventHelper } from "@core/helpers/event.helper";

interface PandaInputProps<T = any> {
  name: Extract<keyof T, string>;
  title: string;
  type: "email" | "info" | "password";
  className?: string;
  remotelyDisabled?: boolean;
  validator?: (text: string) => boolean;
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

interface UsePandaInputArgs<Form> {
  formController: FormController<Form>;
  observable: Observable<ControlNotification>;
}
export function usePandaInput<Form>({
  observable,
  formController,
}: UsePandaInputArgs<Form>) {
  function PandaInput({
    name,
    title,
    type,
    className = "",
    remotelyDisabled,
    validator,
    onDisabled,
    onEnabled,
  }: PandaInputProps<Form>) {
    console.log(`PandaInput Rerender ${name}`);
    const InputIcon = InputIcons[type];

    const [isFilled, setIsFilled] = useState(false);
    const [isValid, setIsValid] = useState(true);

    const setForm = useCallback(
      (value: string) => formController.setField(name, value),
      [name]
    );

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

    const registerValue = useCallback(
      (value: string) => {
        setForm(value);

        const _validator = validator ?? formController.validators[name];

        if (_validator !== undefined) {
          setIsValid(_validator(value));
        }

        if (value !== "") {
          setIsFilled(true);
        } else setIsFilled(false);
      },
      [name, setForm, validator]
    );

    useEffect(() => {
      if (inputRef.current === null) return;
      const changeStream = fromEvent(inputRef.current, "keyup");

      const subscription = changeStream
        .pipe(
          map((event: Event) => (event.target as HTMLInputElement).value),
          debounceTime(300)
        )
        .subscribe(registerValue);

      return () => {
        subscription.unsubscribe();
      };
    }, [registerValue]);

    const isAnimating = useCallback(
      () =>
        [PandaStatus.Appearing, PandaStatus.Vanishing].includes(
          animationProps.status
        ),
      [animationProps.status]
    );

    const disableMe = useCallback(
      (callback?: () => void) => {
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
          status: PandaStatus.Vanishing,
          classes: "vanishing",
        });

        if (pandaInputRef.current === null) return;

        EventHelper.setAnimationEndCallback(
          pandaInputRef.current,
          "vanish-panda",
          () => {
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
      },
      [animationProps, isAnimating, onDisabled]
    );

    const enableMe = useCallback(
      (callback?: () => void) => {
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
            () => {
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
      },
      [animationProps, isAnimating, onEnabled]
    );

    const switchMe = useCallback(
      (callback?: () => void) => {
        if (isAnimating()) return;

        if (animationProps.status === PandaStatus.Appeared) disableMe(callback);
        else if (animationProps.status === PandaStatus.Vanished)
          enableMe(callback);
      },
      [animationProps.status, disableMe, enableMe, isAnimating]
    );
    const clearMe = useCallback(
      (callback?: VoidFunction) => {
        if (inputRef.current !== null) {
          inputRef.current.value = "";
          registerValue("");
        }

        if (callback !== undefined) callback();
      },
      [registerValue]
    );

    useEffect(() => {
      const subscription = observable.subscribe(
        (notification: ControlNotification) => {
          if (notification.field !== name && notification.field !== "*") return;

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
            case "clear":
              clearMe(notification.callback);
              break;
          }
        }
      );
      return () => {
        subscription.unsubscribe();
      };
    }, [clearMe, disableMe, enableMe, name, switchMe]);

    return animationProps.status === PandaStatus.Vanished ? (
      <Fragment />
    ) : (
      <div
        ref={pandaInputRef}
        style={animationProps.style}
        className={`PandaInput flex rounded-xl h-16 w-full hakkunde ${
          isValid ? "" : "invalidated"
        } ${className} ${animationProps.classes}`}>
        <div
          className={`input-box rounded-xl flex flex-col hw-full ${
            isFilled ? "is-filled" : ""
          }`}>
          <span id="input-name" className="text-gray-300">
            {title}
          </span>
          <input
            type={type === "password" ? type : "text"}
            ref={inputRef}
            className="hw-full bg-transparent autofill:bg-black outline-none placeholder:font-bold"
          />
        </div>
        <div id="input-icon" className="h-full flex hakkunde text-gray-300">
          <InputIcon />
        </div>
      </div>
    );
  }

  return PandaInput;
}
