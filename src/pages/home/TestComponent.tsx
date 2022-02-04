import { FormContext } from "@pages/authentication/authentication";

export function JustAClass() {
  return (
    <FormContext.Consumer>
      {(value) => <span className="text-white">{value.firstName}</span>}
    </FormContext.Consumer>
  );
}

// JustAClass.contextType =
