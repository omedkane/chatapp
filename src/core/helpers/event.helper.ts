export abstract class EventHelper {
  static setAnimationEndCallback(
    element: HTMLElement,
    animationName: string | string[],
    callback: (event?: AnimationEvent) => void
  ) {
    const animationsCount =
      typeof animationName === "string" ? 1 : animationName.length;
    let counter = 0;

    const onAnimationEnd = (event: AnimationEvent) => {
      if (
        event.animationName === animationName &&
        ++counter === animationsCount
      ) {
        element.removeEventListener("animationend", onAnimationEnd);
        callback(event);
      }
    };
    element.addEventListener("animationend", onAnimationEnd);
  }

  static setTransitionEndCallback(
    element: HTMLElement,
    propertyName: string,
    callback: (event: TransitionEvent) => void,
    iterationCount: number = 1
  ) {
    let _iterations = 0;
    const onTransitionEnd = (event: TransitionEvent) => {
      if (
        event.target === element &&
        event.propertyName === propertyName &&
        ++_iterations === iterationCount
      ) {
        element.removeEventListener("transitionend", onTransitionEnd);
        callback(event);
      }
    };
    element.addEventListener("transitionend", onTransitionEnd);
  }
}
