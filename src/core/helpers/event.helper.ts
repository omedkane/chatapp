export abstract class EventHelper {
  static setAnimationEndCallback(
    element: HTMLElement,
    animationName: string,
    callback: (event: AnimationEvent) => void
  ) {
    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName === animationName) {
        element.removeEventListener("animationend", onAnimationEnd);
        callback(event);
      }
    };
    element.addEventListener("animationend", onAnimationEnd);
  }
}
