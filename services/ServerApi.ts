import axios, { AxiosError } from "axios";

const ServerApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API_URL,
  headers: {
    ["security-token"]:  process.env.NEXT_PUBLIC_SERVER_API_SECURITY_TOKEN
  }
});

export default ServerApi;

export function isAxiosError<ResponseType>(
  error: unknown
): error is AxiosError<ResponseType> {
  return axios.isAxiosError(error);
}

export async function serverApiFetch<T = any>(url: string) {
  try {
    const response = await ServerApi.get<T>(url);

    return response.data;
  } catch (error) {
    throw error;
  }
}