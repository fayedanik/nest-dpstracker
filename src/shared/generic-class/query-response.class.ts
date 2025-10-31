import { ErrorMessageConst } from '../consts/error.const';

export class QueryResponse<T> {
  constructor(
    public readonly message: string,
    public readonly success: boolean,
    public readonly data: T | null,
    public readonly errors?: any,
  ) {}

  static success<T>(data: T, message = 'Success'): QueryResponse<T> {
    return new QueryResponse<T>(message, true, data);
  }

  static failure<T>(
    message = ErrorMessageConst.SOMETHING_WENT_WRONT,
    errors?: any,
  ): QueryResponse<T> {
    return new QueryResponse<T>(message, false, null, errors);
  }
}
