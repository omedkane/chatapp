import "./TestComponent.scss"
export function JustAClass() {
  console.log("Guess what I just rerendered");

  return (
    <div
      id="TestComponent"
      className="h-24 w-24 radius-1/2"></div>
  );
}

// JustAClass.contextType =
