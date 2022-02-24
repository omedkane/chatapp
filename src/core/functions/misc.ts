export async function runAsync(...functions: (Function | undefined | null)[]) {
  functions.forEach((func) => {
    if (func !== undefined && func !== null) {
      func();
    }
  });
}
export async function runAsyncArr(
  functions: (Function | undefined | null)[],
  callback?: VoidFunction
) {
  functions.forEach((func) => {
    if (func !== undefined && func !== null) {
      func();
    }
  });
  if (callback !== undefined) callback();
}

export const doesExist = (variable: any) =>
  variable !== undefined && variable !== null;
