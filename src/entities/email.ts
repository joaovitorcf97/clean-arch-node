import { Either, left, right } from '@/shared/either';
import { valid } from './email-validator';
import { InvalidEmailError } from './errors/invalid-email-error';

export class Email {
  public readonly value: string;

  private constructor(email: string) {
    this.value = email;
    Object.freeze(this);
  }

  public static create(email: string): Either<InvalidEmailError, Email> {
    if (valid(email)) {
      return right(new Email(email));
    }

    return left(new InvalidEmailError(email));
  }
}
