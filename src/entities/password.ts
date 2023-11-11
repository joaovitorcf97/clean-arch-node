import { Either, left, right } from '@/shared/either';
import { InvalidPasswordError } from './errors/invalid-password-error';

export class Password {
  private readonly _value: string;

  public get value() {
    return this._value;
  }

  constructor(password: string) {
    this._value = password;
    Object.freeze(this);
  }

  public static create(
    password: string
  ): Either<InvalidPasswordError, Password> {
    if (valid(password)) {
      return right(new Password(password));
    }

    return left(new InvalidPasswordError());
  }
}

function valid(password: string): boolean {
  if (!password) {
    return false;
  }

  if (noNumber(password) || tooShort(password)) {
    return false;
  }

  return true;
}

function noNumber(password: string) {
  return !/\d/.test(password);
}

function tooShort(password: string) {
  return password.length < 6;
}
