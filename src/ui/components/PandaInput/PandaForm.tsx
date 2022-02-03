import React, { createContext } from "react";

// export function useForm<T>(fields: T) {
//   const [_fields, setFields] = useState<T>(fields);

//   return [_fields, setFields];
// }

export const FormContext = createContext({});

interface PandaFormProps {
  fields: Object;
}

export class PandaForm extends React.Component<PandaFormProps> {
  render(): React.ReactNode {
    return (
      <FormContext.Provider value={this.props.fields}>
        {this.props.children}
      </FormContext.Provider>
    );
  }
}
