import React, { Context, PropsWithChildren } from "react";
import { usePandaInput } from "./PandaInput";

export function useForm<Form>(context: Context<Form>) {
  return {
    PandaForm: PandaForm<Form>(context),
    PandaInput: usePandaInput<Form>(context),
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
