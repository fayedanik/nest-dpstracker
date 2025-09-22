export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly password?: string,
    public readonly phoneNumber?: string,
  ) {}
}
