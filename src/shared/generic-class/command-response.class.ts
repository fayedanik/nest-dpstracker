export class CommandResponse<T> {
  constructor(
    public readonly message: string,
    public readonly success: boolean,
    public readonly data?: T,
    public readonly errors?: any,
  ) {}

  static success<T>(data?: T, message = 'Success'): CommandResponse<T> {
    return new CommandResponse<T>(message, true, data);
  }

  static failure<T>(message = 'Failure', errors?: any): CommandResponse<T> {
    return new CommandResponse<T>(message, false, null as any, errors);
  }
}
