import { Either, left, right } from '@/shared/either';
import { Encoder } from '../ports/encoder';
import { UserRepository } from '../ports/user-repository';
import { UserNotFoundError } from './errors/user-not-found-error';
import { WrongPasswordError } from './errors/wrong-password-error';
import {
  AuthenticationParams,
  AuthenticationResult,
  AuthenticationService,
} from './ports/authentication-service';
import { TokenManager } from './ports/token-manager';

export class CustomAuthentication implements AuthenticationService {
  private readonly userRepository: UserRepository;
  private readonly encoder: Encoder;
  private readonly tokenManager: TokenManager;

  constructor(
    userRepository: UserRepository,
    encoder: Encoder,
    tokenManager: TokenManager
  ) {
    this.userRepository = userRepository;
    this.encoder = encoder;
    this.tokenManager = tokenManager;
  }

  async auth(
    authenticationParams: AuthenticationParams
  ): Promise<
    Either<UserNotFoundError | WrongPasswordError, AuthenticationResult>
  > {
    const user = await this.userRepository.findByEmail(
      authenticationParams.email
    );

    if (!user) {
      return left(new UserNotFoundError());
    }

    const matches = await this.encoder.compare(
      authenticationParams.password,
      user.password
    );

    if (!matches) {
      return left(new WrongPasswordError());
    }

    const accessToken = await this.tokenManager.sign({ id: user.id! });

    return right({ accessToken: accessToken, id: user.id! });
  }
}
