export interface SessionResponse<T> {
  version: number,
  format: 'BASIC' | 'AGGREGATOR',
  records: T[]
}


export interface CallError {
  desc: string;
  detail: string;
}
