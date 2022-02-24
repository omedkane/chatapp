import "./PandaInput.scss";
import {
  CSSProperties,
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiFillEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { HiMail } from "react-icons/hi";
import { FaUserEdit } from "react-icons/fa";
// @ts-ignore
import { debounceTime, fromEvent, map, Observable, Subscription } from "rxjs";
import { ControlNotification, FormController } from "./PandaForm";
import { EventHelper } from "@core/helpers/event.helper";

interface PandaInputProps<T = any> {
  name: Extract<keyof T, string>;
  title: string;
  type: "email" | "info" | "password";
  className?: string;
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
  [key in PandaInputProps["type"]]: (...args: any) => JSX.Element;
};

const InputIcons: PandaInputIcons = {
  email: () => <HiMail size={24} />,
  info: () => <FaUserEdit size={24} />,
  password: ({
    passwordVisible,
    onClick,
  }: {
    passwordVisible: boolean;
    onClick: VoidFunction;
  }) => {
    return passwordVisible ? (
      <AiOutlineEye size={24} className="cursor-pointer" onClick={onClick} />
    ) : (
      <AiFillEyeInvisible
        size={24}
        className="cursor-pointer"
        onClick={onClick}
      />
    );
  },
};

interface UsePandaInputArgs<Form> {
  formController: FormController<Form>;
  observable: Observable<ControlNotification>;
  onPressEnter: VoidFunction;
}
export function usePandaInput<Form>({
  observable,
  formController,
  onPressEnter,
}: UsePandaInputArgs<Form>) {
  function PandaInput({
    name,
    title,
    type,
    className = "",
    onDisabled,
    onEnabled,
  }: PandaInputProps<Form>) {
    console.log(`PandaInput Rerender ${name}`);
    const InputIcon = InputIcons[type];

    const [isFilled, setIsFilled] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [subscription, setSubscription] = useState<Subscription>();

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

    const registerValue = useCallback(
      (value: string) => {
        console.log({
          name,
          log: "This isn't doin' shit",
        });

        setForm(value);

        const _validator =  formController.validators[name]?.validator;

        if (value !== "") {
          setIsFilled(true);
          if (_validator !== undefined) {
            setIsValid(_validator(value));
          }
        } else {
          setIsFilled(false);
          setIsValid(true);
        }
      },
      [name, setForm]
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

    const setUp = useCallback(() => {
      globalThis.requestAnimationFrame(() => {
        if (inputRef.current === null) return;
        console.log({ name, msg: "Sweet, I just subscribed" });

        const changeStream = fromEvent(inputRef.current, "keyup");

        const subscription = changeStream
          .pipe(
            map((event: Event) => (event.target as HTMLInputElement).value),
            debounceTime(300)
          )
          .subscribe(registerValue);

        setSubscription(subscription);
      });
    }, [name, registerValue]);

    useEffect(() => {
      setUp();
    }, [setUp]);

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

        if (subscription !== undefined) {
          subscription.unsubscribe();
          console.log({ name, msg: "Yep I unsubscribed" });
        }

        clearMe();

        setAnimationProps({
          ...animationProps,
          status: PandaStatus.Vanishing,
          classes: "vanishing",
        });

        setSubscription(undefined);

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
      [animationProps, clearMe, isAnimating, name, onDisabled, subscription]
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

          setUp();

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
      [animationProps, isAnimating, onEnabled, setUp]
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

    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };

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
            type={type === "password" && !passwordVisible ? type : "text"}
            ref={inputRef}
            onKeyUp={(event) => {
              if (event.key === "Enter") {
                onPressEnter();
              }
            }}
            className="hw-full bg-transparent autofill:bg-black outline-none placeholder:font-bold"
          />
        </div>
        <div id="input-icon" className="h-full flex hakkunde text-gray-300">
          {type === "password" ? (
            <InputIcon
              passwordVisible={passwordVisible}
              onClick={() => togglePasswordVisibility()}
            />
          ) : (
            <InputIcon />
          )}
        </div>
      </div>
    );
  }

  return PandaInput;
}
