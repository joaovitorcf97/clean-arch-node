import {
  Payload,
  TokenManager,
} from '@/use-cases/authentication/ports/token-manager';

import { HttpResponse } from '../controller/ports/http-response';
import { forbidden, ok, serverError } from '../controller/utils/http-helper';
import { Middleware } from './ports/middlwware';

export class Authentication implements Middleware {
  private readonly tokenManager: TokenManager;

  constructor(tokenManager: TokenManager) {
    this.tokenManager = tokenManager;
  }

  async handle(request: any): Promise<HttpResponse> {
    try {
      const { accessToken, requesterId } = request;

      if (!accessToken || !requesterId) {
        return forbidden(new Error('Invalid token or requester id.'));
      }

      const decodedTokenOrError = await this.tokenManager.verify(accessToken);

      if (decodedTokenOrError.isLeft()) {
        return forbidden(decodedTokenOrError.value);
      }

      const payload: Payload = decodedTokenOrError.value as Payload;

      if (payload.id === requesterId) {
        return ok(payload);
      }

      return forbidden(
        new Error('User not allowed to perform this operation.')
      );
    } catch (error: any) {
      return serverError(error);
    }
  }
}
