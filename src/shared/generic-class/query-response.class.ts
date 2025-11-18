import { ErrorMessageConst } from '../consts/error.const';

export class QueryResponse<T> {
  constructor(
    public readonly message: string,
    public readonly success: boolean,
    public readonly data: T | null,
    public readonly errors?: any,
    public readonly totalCount: number = 0,
  ) {}

  static success<T>(
    data: T,
    message = 'Success',
    totalCount = 0,
  ): QueryResponse<T> {
    return new QueryResponse<T>(message, true, data, null, totalCount);
  }

  static failure<T>(
    message = ErrorMessageConst.SOMETHING_WENT_WRONT,
    errors?: any,
  ): QueryResponse<T> {
    return new QueryResponse<T>(message, false, null, errors);
  }
}
