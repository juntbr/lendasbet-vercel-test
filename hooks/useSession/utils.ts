import { CallError } from "./types";

export function isSessionCallError(error: any): error is CallError {
  return (
    (error as CallError).desc !== undefined &&
    (error as CallError).detail !== undefined
  );
}
