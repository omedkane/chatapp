import "./PandaInput.scss";
import {
  Component,
  createRef,
  CSSProperties,
  Fragment,
  ReactNode,
  RefObject,
} from "react";
import { AiFillEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { HiMail } from "react-icons/hi";
import { FaUserEdit } from "react-icons/fa";
// @ts-ignore
import { debounceTime, fromEvent, map, Observable, Subscription } from "rxjs";
import { ControlNotification, FormController } from "./PandaForm";
import { EventHelper } from "@core/helpers/event.helper";
import produce from "immer";

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

interface PandaInputState {
  isFilled: boolean;
  isValid: boolean;
  passwordVisible: boolean;
  visualState: {
    status: PandaStatus;
    savedWidth: string;
    savedMargin: string;
    classes: string;
    style: CSSProperties;
  };
}

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
  class PandaInput extends Component<PandaInputProps<Form>, PandaInputState> {
    inputRef: RefObject<HTMLInputElement>;
    pandaInputRef: RefObject<HTMLDivElement>;
    inputSubscription?: Subscription;
    formSubscription?: Subscription;

    constructor(
      props: PandaInputProps<Form> | Readonly<PandaInputProps<Form>>
    ) {
      super(props);
      this.inputRef = createRef<HTMLInputElement>();
      this.pandaInputRef = createRef<HTMLDivElement>();

      this.state = {
        isFilled: false,
        isValid: true,
        passwordVisible: false,
        visualState: {
          status: PandaStatus.Appeared,
          savedWidth: "0",
          savedMargin: "0",
          classes: "",
          style: {
            "--panda-width": "0px",
          } as CSSProperties,
        },
      };
    }

    componentDidUpdate() {
      if (this.inputRef.current !== null)
        this.setForm(this.inputRef.current.value);
    }

    setForm = (value: string) => {
      return formController.setField(this.props.name, value);
    };

    registerValue = (value: string) => {
      console.log({
        name: this.props.name,
        log: "This isn't doin' shit",
      });

      this.setForm(value);

      const _validator = formController.validators[this.props.name]?.validator;

      if (value !== "") {
        this.setState((state) =>
          produce(state, (draft) => {
            draft.isFilled = true;
            draft.isValid = _validator !== undefined ? _validator(value) : true;
          })
        );
      } else {
        console.log("I've been cleared");

        this.setState((state) =>
          produce(state, (draft) => {
            draft.isFilled = false;
            draft.isValid = true;
          })
        );
      }
    };

    clearMe = (callback?: VoidFunction) => {
      if (this.inputRef.current !== null) {
        this.inputRef.current.value = "";
        this.registerValue("");
      }
      if (callback !== undefined) callback();
    };

    subscribeToInput = () => {
      if (this.inputRef.current === null) return;
      console.log({ name: this.props.name, msg: "Sweet, I just subscribed" });

      const changeStream = fromEvent(this.inputRef.current, "keyup");

      this.inputSubscription = changeStream
        .pipe(
          map((event: Event) => (event.target as HTMLInputElement).value),
          debounceTime(300)
        )
        .subscribe(this.registerValue);
    };
    subscribeToForm = () => {
      this.formSubscription = observable.subscribe(
        (notification: ControlNotification) => {
          if (
            notification.field !== this.props.name &&
            notification.field !== "*"
          )
            return;

          switch (notification.operation) {
            case "disable":
              this.disableMe(notification.callback);
              break;
            case "enable":
              this.enableMe(notification.callback);
              break;
            case "switch":
              this.switchMe(notification.callback);
              break;
            case "clear":
              this.clearMe(notification.callback);
              break;
          }
        }
      );
    };

    componentDidMount() {
      this.subscribeToForm();
      this.subscribeToInput();
    }

    componentWillUnmount() {
      this.inputSubscription?.unsubscribe();
      this.formSubscription?.unsubscribe();
    }

    isAnimating = () => {
      return [PandaStatus.Appearing, PandaStatus.Vanishing].includes(
        this.state.visualState.status
      );
    };

    disableMe = (callback?: VoidFunction) => {
      if (
        this.state.visualState.status === PandaStatus.Vanished ||
        this.isAnimating() ||
        this.pandaInputRef.current === null
      )
        return;

      const { width: _currentWidth, margin: _currentMargin } =
        globalThis.getComputedStyle(this.pandaInputRef.current);

      this.clearMe();
      this.inputSubscription?.unsubscribe();

      this.setState((state) =>
        produce(state, (draft) => {
          const vState = draft.visualState;
          vState.status = PandaStatus.Vanishing;
          vState.classes = "vanishing";
        })
      );
      console.log("before animation");

      console.table(this.state);

      if (this.pandaInputRef.current === null) return;
      EventHelper.setAnimationEndCallback(
        this.pandaInputRef.current,
        "vanish-panda",
        () => {
          if (_currentWidth) {
            this.setState((state) =>
              produce(state, (draft) => {
                const vState = draft.visualState;

                vState.savedWidth = _currentWidth;
                vState.savedMargin = _currentMargin;
                vState.status = PandaStatus.Vanished;
                vState.classes = "vanished";
              })
            );

            console.log({
              name: this.props.name,
              isFilled: this.state.isFilled,
            });

            globalThis.requestAnimationFrame(() => {
              if (this.props.onDisabled !== undefined) this.props.onDisabled();
              if (callback !== undefined) callback();
            });
          }
        }
      );
    };

    enableMe = (callback?: VoidFunction) => {
      if (
        this.state.visualState.status === PandaStatus.Appeared ||
        this.isAnimating()
      )
        return;
      this.setState((state) =>
        produce(state, (draft) => {
          const vState = draft.visualState;
          vState.status = PandaStatus.Appearing;
          vState.classes = "vanished appearing";
          vState.style = {
            "--panda-width": this.state.visualState.savedWidth,
            "--panda-margin": this.state.visualState.savedMargin,
          } as CSSProperties;
        })
      );

      requestAnimationFrame(() => {
        if (this.pandaInputRef.current === null) return;
        console.log("what bout this");

        this.subscribeToInput();

        EventHelper.setAnimationEndCallback(
          this.pandaInputRef.current,
          "show-input-box",
          () => {
            this.setState((state) =>
              produce(state, (draft) => {
                const vState = draft.visualState;

                vState.status = PandaStatus.Appeared;
                vState.classes = "";
                vState.style = {};
              })
            );

            globalThis.requestAnimationFrame(() => {
              if (this.props.onEnabled !== undefined) this.props.onEnabled();
              if (callback !== undefined) callback();
            });
          }
        );
      });
    };

    switchMe = (callback?: () => void) => {
      if (this.isAnimating()) return;

      if (this.state.visualState.status === PandaStatus.Appeared)
        this.disableMe(callback);
      else if (this.state.visualState.status === PandaStatus.Vanished)
        this.enableMe(callback);
    };

    togglePasswordVisibility = () => {
      this.setState((state) =>
        produce(state, (draft) => {
          draft.passwordVisible = !draft.passwordVisible;
        })
      );
    };

    InputIcon = InputIcons[this.props.type];

    render(): ReactNode {
      return this.state.visualState.status === PandaStatus.Vanished ? (
        <Fragment />
      ) : (
        <div
          ref={this.pandaInputRef}
          style={this.state.visualState.style}
          className={`PandaInput flex rounded-xl h-16 w-full hakkunde ${
            this.state.isValid ? "" : "invalidated"
          } ${this.props.className} ${this.state.visualState.classes}`}>
          <div
            className={`input-box rounded-xl flex flex-col hw-full ${
              this.state.isFilled ? "is-filled" : ""
            }`}>
            <span id="input-name" className="text-gray-300">
              {this.props.title}
            </span>
            <input
              type={
                this.props.type === "password" && !this.state.passwordVisible
                  ? this.props.type
                  : "text"
              }
              ref={this.inputRef}
              onKeyUp={(event) => {
                if (event.key === "Enter") {
                  onPressEnter();
                }
              }}
              className="hw-full bg-transparent autofill:bg-black outline-none placeholder:font-bold"
            />
          </div>
          <div id="input-icon" className="h-full flex hakkunde text-gray-300">
            {this.props.type === "password" ? (
              <this.InputIcon
                passwordVisible={this.state.passwordVisible}
                onClick={() => this.togglePasswordVisibility()}
              />
            ) : (
              <this.InputIcon />
            )}
          </div>
        </div>
      );
    }
  }

  return PandaInput;
}
