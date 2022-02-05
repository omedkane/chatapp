import { ReactElement, useEffect, useState } from "react";
import { usePandaInput } from "./PandaInput";
// @ts-ignore
import { Subject } from "rxjs";
import { AnyObject } from "immer/dist/internal";

export function useForm<Form extends object>(fields: Form) {
  type NumString = string | number;
  type Emission = { field: string; value: NumString };
  const subject = new Subject<Emission>();

  interface ConsumerProps {
    field: keyof Form;
    children: (value: any) => ReactElement;
  }

  function Consumer(props: ConsumerProps) {
    const [value, setValue] = useState<NumString>("");

    useEffect(() => {
      const subscription = subject.subscribe({
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

  const proxy = new Proxy(fields, {
    set: (fieldMap: AnyObject, field: string, value: NumString) => {
      fieldMap[field] = value;
      subject.next({ field, value });
      return true;
    },
  });

  const setField = (field: string, value: NumString) => {
    proxy[field] = value;
  };

  const [{ FormConsumer, InputComponent, form }] = useState({
    InputComponent: usePandaInput<Form>(setField),
    FormConsumer: Consumer,
    form: proxy,
  });

  return { PandaInput: InputComponent, FormConsumer, form };
}
