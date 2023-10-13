export interface Response<T = any> {
  error: boolean;
  statusCode: number | string;
  data: T;
  message?: string;
}
