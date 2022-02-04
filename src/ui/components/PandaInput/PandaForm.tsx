import React, { Context, createContext, PropsWithChildren } from "react";
import { PandaInput } from "./PandaInput";

export function useForm<Form>(contextValue: Form) {
  const context = createContext(contextValue);
  return {
    PandaForm: PandaForm<Form>(context),
    PandaInput: PandaInput<Form>(context),
  };
}

interface PandaFormProps<Form> {
  fieldMap: Form;
}

export function PandaForm<Form>(FormContext: Context<Form>) {
  return (props: PropsWithChildren<PandaFormProps<Form>>) => (
    <FormContext.Provider value={props.fieldMap}>
      {props.children}
    </FormContext.Provider>
  );
}
