import "./AnimatedSize.scss";
import {
  PropsWithChildren,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { EventHelper } from "@core/helpers/event.helper";

interface ResizableProps {
  /** Duration must be in Seconds */
  duration?: number;
}
/** Warning children must have keys and different ones */
export function AnimatedSize({
  children,
  duration,
}: PropsWithChildren<ResizableProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [child, setChild] = useState<ReactElement>(children as ReactElement);
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (containerRef.current === null) return;
    const container = containerRef.current;

    container.style.height = container.clientHeight + "px";
    container.style.width = container.clientWidth + "px";

    if (duration !== undefined)
      container.style.transitionDuration = duration + "s";
  }, [duration]);

  useEffect(() => {
    if ((children as ReactElement).key === null)
      throw Error("Children must have keys");

    if (init === false) {
      setInit(true);
      return;
    }
    if (containerRef.current === null) return;

    const container = containerRef.current;
    const subContainer = container.firstElementChild;
    const _children = children as ReactElement;

    if (subContainer === null) return;

    console.log("Ooops I did it again !");
    container.style.opacity = "0";

    EventHelper.setTransitionEndCallback(container, "opacity", () => {
      setChild(_children);

      globalThis.requestAnimationFrame(() => {
        const hasSameHeight =
          container.clientHeight === subContainer.scrollHeight;
        const hasSameWidth = container.clientWidth === subContainer.scrollWidth;

        if (hasSameHeight && hasSameWidth) {
          container.style.opacity = "1";
        } else {
          container.style.height = subContainer.scrollHeight + "px";
          container.style.width = subContainer.scrollWidth + "px";

          EventHelper.setTransitionEndCallback(
            container,
            !hasSameHeight ? "height" : "width",
            () => {
              container.style.opacity = "1";
            }
          );
        }
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(children as ReactElement).key]);

  const Child = () => child;
  return (
    <div ref={containerRef} className="resizable-container">
      <div id="sub-container">
        <Child />
      </div>
    </div>
  );
}
