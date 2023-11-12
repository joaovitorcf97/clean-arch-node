import { Either } from '@/shared/either';
import { UserNotFoundError } from '@/use-cases/authentication/errors/user-not-found-error';
import { WrongPasswordError } from '@/use-cases/authentication/errors/wrong-password-error';
import { AuthenticationResult } from '@/use-cases/authentication/ports/authentication-service';
import { UseCase } from '@/use-cases/ports/use-case';
import { ControllerOperation } from './ports/controller-operation';
import { HttpResponse } from './ports/http-response';
import { HttpRequest } from './ports/http-resquest';
import { badRequest, forbidden, ok } from './utils/http-helper';

export class SignInOperation implements ControllerOperation {
  readonly requiredParams = ['email', 'password'];
  private readonly useCase: UseCase;

  constructor(useCase: UseCase) {
    this.useCase = useCase;
  }

  async specificOp(request: HttpRequest): Promise<HttpResponse> {
    const response: Either<
      UserNotFoundError | WrongPasswordError,
      AuthenticationResult
    > = await this.useCase.perform({
      email: request.body.email,
      password: request.body.password,
    });

    if (response.isRight()) {
      return ok(response.value);
    }

    if (response.value instanceof WrongPasswordError) {
      return forbidden(response.value);
    }

    return badRequest(response.value);
  }
}
