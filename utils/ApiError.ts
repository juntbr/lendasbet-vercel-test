interface ApiErrorOptions extends ErrorOptions {
  statusCode?: number | string;
}

export class ApiError extends Error {
  statusCode: number | string;

  constructor(message: string, options?: ApiErrorOptions) {
    super(message, { cause: options?.cause });
    this.statusCode = options?.statusCode;
  }
}
