import { ReactElement, useEffect, useState } from "react";
import { usePandaInput } from "./PandaInput";
// @ts-ignore
import { Subject } from "rxjs";
import { AnyObject } from "immer/dist/internal";

export type Emission = { field: string; value: NumString };
type RemoteOperationType = "disable" | "enable" | "switch" | "clear";
export type ControlNotification = {
  field: string;
  operation: RemoteOperationType;
  callback?: () => void;
};
export type NumString = string | number;

type FormValidators<Form> = {
  [field in keyof Form]?: (text: string) => boolean;
};

export type FormController<Form> = {
  validators: FormValidators<Form>;
  form: Form;
  setField: (field: keyof Form, value: NumString) => void;
  notify: (_: {
    operation: RemoteOperationType;
    fields: (keyof Form)[] | ["*"];
    callback?: () => void;
  }) => void;
};

export function useForm<Form extends {}>(
  fields: Form,
  validators: FormValidators<Form>
) {
  const updateSubject = new Subject<Emission>();
  const inputController = new Subject<ControlNotification>();

  type Fields = keyof Form;
  type _FormController = FormController<Form>;

  interface ConsumerProps {
    field: Fields;
    children: (value: any) => ReactElement;
  }

  function Consumer(props: ConsumerProps) {
    const [value, setValue] = useState<NumString>("");

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

  const formController: _FormController = {
    form: new Proxy<Form>(fields, {
      set: (fieldMap: Form, field: string, value: NumString) => {
        (fieldMap as AnyObject)[field] = value;
        updateSubject.next({ field, value });
        return true;
      },
    }),
    validators,
    setField: function (field: Fields, value: NumString) {
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
  };

  const [{ FormConsumer, InputComponent, controller, form }] = useState({
    InputComponent: usePandaInput<Form>({
      observable: inputController.asObservable(),
      formController,
    }),
    FormConsumer: Consumer,
    controller: formController,
    form: formController.form,
  });

  return { PandaInput: InputComponent, FormConsumer, controller, form };
}
