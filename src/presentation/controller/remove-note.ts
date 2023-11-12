import { Either } from '@/shared/either';
import { UseCase } from '@/use-cases/ports/use-case';
import { UnexistingNoteError } from '@/use-cases/remove-notes/error/unexisting-note-error';
import { ControllerOperation } from './ports/controller-operation';
import { HttpResponse } from './ports/http-response';
import { HttpRequest } from './ports/http-resquest';
import { badRequest, ok } from './utils/http-helper';

export class RemoveNoteOperation implements ControllerOperation {
  readonly requiredParams = ['noteId'];
  private readonly useCase: UseCase;

  constructor(useCase: UseCase) {
    this.useCase = useCase;
  }

  async specificOp(request: HttpRequest): Promise<HttpResponse> {
    const useCaseResponse: Either<UnexistingNoteError, void> =
      await this.useCase.perform(request.body.noteId);

    if (useCaseResponse.isRight()) {
      return ok(useCaseResponse.value);
    }

    return badRequest(useCaseResponse.value);
  }
}
