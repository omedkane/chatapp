import { ReactElement, useEffect, useState } from "react";
import { usePandaInput } from "./PandaInput";
// @ts-ignore
import { Subject } from "rxjs";
import { AnyObject } from "immer/dist/internal";

export type Emission = { field: string; value: string };
type RemoteOperationType = "disable" | "enable" | "switch" | "clear";
export type ControlNotification = {
  field: string;
  operation: RemoteOperationType;
  callback?: () => void;
};

type FormValidators<Form> = {
  [field in keyof Form]?: {
    // ! refactor this to numstring
    validator: (text: string) => boolean;
    message: string;
  };
};

export type FormController<Form> = {
  validators: FormValidators<Form>;
  form: Form;
  setField: (field: keyof Form, value: string) => void;
  notify: (_: {
    operation: RemoteOperationType;
    fields: (keyof Form)[] | ["*"];
    callback?: () => void;
  }) => void;
  validate: (args: {
    targetFields?: (keyof Form)[];
    onValidationError: (message: string) => void;
    onSuccess: VoidFunction;
  }) => void;
};

interface UseFormArgs<Form> {
  fields: Form;
  validators: FormValidators<Form>;
  onSubmit: VoidFunction;
}

export function useForm<Form extends { [key: string]: string }>({
  fields,
  validators,
  onSubmit,
}: UseFormArgs<Form>) {
  const updateSubject = new Subject<Emission>();
  const inputController = new Subject<ControlNotification>();

  type Fields = keyof Form;
  type _FormController = FormController<Form>;

  interface ConsumerProps {
    field: Fields;
    children: (value: any) => ReactElement;
  }

  function Consumer(props: ConsumerProps) {
    const [value, setValue] = useState<string>("");

    useEffect(() => {
      const subscription = updateSubject.subscribe({
        next: (val: Emission) => {
          if (val.field === props.field) {
            console.log(val.field);
            setValue(val.value);
          }
        },
      });
      return () => {
        if (!subscription.closed) subscription.unsubscribe();
      };
    }, [props.field]);

    const Child = () => props.children(value);

    return <Child />;
  }

  const _formController: _FormController = {
    form: new Proxy<Form>(fields, {
      set: (fieldMap: Form, field: string, value: string) => {
        (fieldMap as AnyObject)[field] = value;
        updateSubject.next({ field, value });
        return true;
      },
    }),
    validators,
    setField: function (field: Fields, value: string) {
      const obj = this.form as AnyObject;
      obj[field as string] = value;
    },
    notify: ({ operation, fields, callback }) => {
      let doneCount = 0;
      const fieldsLength = fields.length;
      fields.forEach((field: keyof Form | "*") => {
        inputController?.next({
          field: field as string,
          operation,
          callback:
            callback === undefined
              ? undefined
              : () => {
                  if (++doneCount === fieldsLength) {
                    callback();
                  }
                },
        });
      });
    },
    validate: function (this, { targetFields, onValidationError, onSuccess }) {
      const _targetFields = targetFields ?? Object.keys(fields);

      for (const field of _targetFields) {
        const value = this.form[field];
        const validation = validators[field];
        if (validation !== undefined && !validation.validator(value))
          return onValidationError(validation.message);
      }
      onSuccess();
    },
  };

  const [{ FormConsumer, InputComponent, formController, form }] = useState({
    InputComponent: usePandaInput<Form>({
      observable: inputController.asObservable(),
      formController: _formController,
      onPressEnter: onSubmit,
    }),
    FormConsumer: Consumer,
    formController: _formController,
    form: _formController.form,
  });

  return { PandaInput: InputComponent, FormConsumer, formController, form };
}
