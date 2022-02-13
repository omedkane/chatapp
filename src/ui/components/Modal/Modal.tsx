import { AnimationStatus } from "@core/enum/animation.enum";
import { runAsync, runAsyncArr } from "@core/functions/misc";
import { EventHelper } from "@core/helpers/event.helper";
import {
  Fragment,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
// @ts-ignore
import { Subject } from "rxjs";
import "./Modal.scss";

export function useModal() {
  type ModalNotification =
    | {
        operation: "open";
        child: ReactElement;
        callback?: VoidFunction;
        onClose?: VoidFunction;
      }
    | { operation: "close"; callback?: VoidFunction };

  const modalNotifier = new Subject<ModalNotification>();
  let scheduledOnCloseCallback: VoidFunction | null;

  function _Modal() {
    type ModalConfig = {
      child?: ReactElement;
      visible: boolean;
      animationStatus: AnimationStatus;
    };
    const [config, setConfig] = useState<ModalConfig>({
      visible: false,
      animationStatus: AnimationStatus.Appearing,
    });

    const modalRef = useRef<HTMLDivElement>(null);

    const openMe = (
      _child: ReactElement,
      onOpen?: VoidFunction,
      onClose?: VoidFunction
    ) => {
      setConfig({
        visible: true,
        child: _child,
        animationStatus: AnimationStatus.Appearing,
      });

      globalThis.requestAnimationFrame(() => {
        const modal = modalRef.current;
        const parent = modal?.parentElement;

        if (modal === null || parent === null || parent === undefined) return;

        parent.style.position = "relative";
        parent.style.overflow = "hidden";

        EventHelper.setAnimationEndCallback(modal, "content-appear", () => {
          setConfig({
            // ...config,
            visible: true,
            child: _child,
            animationStatus: AnimationStatus.Appeared,
          });
          runAsync(onOpen);
          if (onClose !== undefined) {
            scheduledOnCloseCallback = onClose;
          }
        });
      });
    };
    const closeMe = useCallback(
      (onClose?: VoidFunction) => {
        if (modalRef.current === null) {
          return;
        }
        const modal = modalRef.current;
        const parent = modal.parentElement;

        setConfig({ ...config, animationStatus: AnimationStatus.Vanishing });

        EventHelper.setAnimationEndCallback(modal, "overlay-vanish", () => {
          console.log("is this thing on ?");

          setConfig({
            ...config,
            visible: false,
            animationStatus: AnimationStatus.Vanished,
          });
          globalThis.requestAnimationFrame(() => {
            if (parent !== null && parent !== undefined)
              parent.style.position = "";

            runAsyncArr([onClose, scheduledOnCloseCallback], () => {
              scheduledOnCloseCallback = null;
            });
          });
        });
      },
      [config]
    );

    useEffect(() => {
      const subscription = modalNotifier.subscribe(
        (notification: ModalNotification) => {
          switch (notification.operation) {
            case "open":
              openMe(
                notification.child,
                notification.callback,
                notification.onClose
              );
              console.log("good til effect");

              break;
            case "close":
              closeMe(notification.callback);
              break;
          }
        }
      );
      return () => {
        subscription.unsubscribe();
      };
    }, [closeMe]);

    const Child = () => config.child as ReactElement;
    return !config.visible ? (
      <Fragment />
    ) : (
      <div className="Modal" ref={modalRef}>
        <div
          id="overlay"
          className={config.animationStatus}
          onClick={() => closeMe()}
        />
        <div id="actual-content" className={config.animationStatus}>
          <Child />
        </div>
      </div>
    );
  }
  const [{ Modal, openModal, closeModal }] = useState({
    Modal: _Modal,
    openModal: (
      child: ReactElement,
      callback?: VoidFunction,
      onClose?: VoidFunction
    ) => {
      modalNotifier.next({
        operation: "open",
        child,
        callback,
        onClose,
      });
    },
    closeModal: (callback?: VoidFunction) => {
      modalNotifier.next({ operation: "close", callback });
    },
  });

  return {
    Modal,
    openModal,
    closeModal,
  };
}
