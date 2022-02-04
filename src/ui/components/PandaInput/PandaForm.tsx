import React, { Context, PropsWithChildren, useContext, useState } from "react";
import { usePandaInput } from "./PandaInput";

interface PandaFormProps<Form> {
  fieldMap: Form;
}

export function useForm<Form>(FormContext: Context<Form>) {
  function PandaForm(props: PropsWithChildren<PandaFormProps<Form>>) {
    return (
      <FormContext.Provider value={props.fieldMap}>
        {props.children}
      </FormContext.Provider>
    );
  }

  const [{ FormComponent, InputComponent }] = useState({
    FormComponent: PandaForm,
    InputComponent: usePandaInput<Form>(FormContext),
  });

  const form = useContext(FormContext);

  return { PandaForm: FormComponent, PandaInput: InputComponent, form };
}
