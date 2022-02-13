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

export function useForm<Form>(fields: Form) {
  const updateSubject = new Subject<Emission>();
  const inputController = new Subject<ControlNotification>();

  type Fields = keyof Form;
  type RemodeledFieldMap = Form & {
    notify: (_: {
      operation: RemoteOperationType;
      fields: Fields[] | ["*"];
      callback?: () => void;
    }) => void;
  };

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

  const remodeledFieldMap: RemodeledFieldMap = {
    ...fields,
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
  const proxy = new Proxy<typeof remodeledFieldMap>(remodeledFieldMap, {
    set: (fieldMap: AnyObject, field: string, value: NumString) => {
      fieldMap[field] = value;
      updateSubject.next({ field, value });
      return true;
    },
  });

  const setField = (field: string, value: NumString) => {
    const obj = proxy as AnyObject;
    obj[field] = value;
  };

  const [{ FormConsumer, InputComponent, form }] = useState({
    InputComponent: usePandaInput<Form>(setField, inputController),
    FormConsumer: Consumer,
    form: proxy,
  });

  return { PandaInput: InputComponent, FormConsumer, form };
}
