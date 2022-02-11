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
    | { operation: "open"; child: ReactElement; callback?: VoidFunction }
    | { operation: "close"; callback?: VoidFunction };

  const modalNotifier = new Subject<ModalNotification>();

  interface ModalProps {
    className?: string;
  }
  function Modal({ className }: ModalProps) {
    type ModalConfig = {
      child?: ReactElement;
      visible: boolean;
      animationStatus: "appearing" | "vanishing";
    };
    const [config, setConfig] = useState<ModalConfig>({
      visible: false,
      animationStatus: "appearing",
    });

    const modalRef = useRef<HTMLDivElement>(null);

    const openMe = (_child: ReactElement, onOpen?: VoidFunction) => {
      setConfig({ visible: true, child: _child, animationStatus: "appearing" });

      globalThis.requestAnimationFrame(() => {
        const modal = modalRef.current;
        const parent = modal?.parentElement;

        if (modal === null || parent === null || parent === undefined) return;

        parent.style.position = "relative";
        parent.style.overflow = "hidden";

        if (onOpen === undefined) return;

        EventHelper.setAnimationEndCallback(modal, "content-appear", () => {
          onOpen();
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
        // console.log(modal);

        setConfig({ ...config, animationStatus: "vanishing" });

        EventHelper.setAnimationEndCallback(modal, "overlay-vanish", () => {
          console.log("is this thing on ?");

          setConfig({
            ...config,
            visible: false,
          });
          globalThis.requestAnimationFrame(() => {
            if (parent !== null && parent !== undefined)
              parent.style.position = "";

            if (onClose !== undefined) onClose();
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
              openMe(notification.child, notification.callback);
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
  // const [{ Modal, openModal, closeModal }] = useState();
  return {
    Modal,
    openModal: (child: ReactElement, callback?: VoidFunction) => {
      modalNotifier.next({
        operation: "open",
        child,
        callback,
      });
    },
    closeModal: (callback?: VoidFunction) => {
      modalNotifier.next({ operation: "close", callback });
    },
  };
}
