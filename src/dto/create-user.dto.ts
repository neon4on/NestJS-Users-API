export class CreateUserDto {
  readonly login: string;
  readonly email: string;
  readonly password: string;
  readonly age: number;
  readonly description: string;
}
