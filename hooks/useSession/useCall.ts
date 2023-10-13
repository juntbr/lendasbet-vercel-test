import useSWR from "swr";
import { useSession } from "./useSession";

interface UseCallResponse<T> {
  isLoading: boolean;
  isError: boolean;
  data: T;
  errorMessage: string;
}

export function useCall<T = any, P = any>(
  topicUri: string,
  params?: P
): UseCallResponse<T> {
  const { session } = useSession();

  const { data, error } = useSWR<T>(topicUri, async (url: string) => {
    return session.call<T>(url, params ?? {});
  });

  return {
    isLoading: !error && !data,
    isError: error,
    data,
    errorMessage: error,
  };
}
