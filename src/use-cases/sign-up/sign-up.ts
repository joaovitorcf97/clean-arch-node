import { InvalidEmailError } from '@/entities/errors/invalid-email-error';
import { InvalidPasswordError } from '@/entities/errors/invalid-password-error';
import { User } from '@/entities/user';
import { Either, left, right } from '@/shared/either';
import {
  AuthenticationResult,
  AuthenticationService,
} from '../authentication/ports/authentication-service';
import { Encoder } from '../ports/encoder';
import { UseCase } from '../ports/use-case';
import { UserData } from '../ports/user-data';
import { UserRepository } from '../ports/user-repository';
import { ExistingUserError } from './errors/existing-user-error';

export class SignUp implements UseCase {
  private readonly userRepository: UserRepository;
  private readonly encoder: Encoder;
  private readonly authentication: AuthenticationService;

  constructor(
    userRepository: UserRepository,
    encoder: Encoder,
    authentication: AuthenticationService
  ) {
    this.userRepository = userRepository;
    this.encoder = encoder;
    this.authentication = authentication;
  }

  public async perform(
    userSignUpRequest: UserData
  ): Promise<
    Either<
      ExistingUserError | InvalidEmailError | InvalidPasswordError,
      AuthenticationResult
    >
  > {
    const userOrError = User.create(
      userSignUpRequest.email,
      userSignUpRequest.password
    );
    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const user = await this.userRepository.findByEmail(userSignUpRequest.email);

    if (user) {
      return left(new ExistingUserError(userSignUpRequest));
    }

    const encodedPassword = await this.encoder.encode(
      userSignUpRequest.password
    );

    await this.userRepository.add({
      email: userSignUpRequest.email,
      password: encodedPassword,
    });

    const response = (
      await this.authentication.auth({
        email: userSignUpRequest.email,
        password: userSignUpRequest.password,
      })
    ).value as AuthenticationResult;

    return right(response);
  }
}
