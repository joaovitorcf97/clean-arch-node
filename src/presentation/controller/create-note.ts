import { InvalidTitleError } from '@/entities/errors/invalid-title-error';
import { Either } from '@/shared/either';
import { ExistingTitleError } from '@/use-cases/create-note/errors/existing-title-error';
import { UnregisteredOwnerError } from '@/use-cases/create-note/errors/invalid-owner-error';
import { NoteData } from '@/use-cases/ports/node-data';
import { UseCase } from '@/use-cases/ports/use-case';
import { ControllerOperation } from './ports/controller-operation';
import { HttpResponse } from './ports/http-response';
import { HttpRequest } from './ports/http-resquest';
import { badRequest, created } from './utils/http-helper';

export class CreateNoteOperation implements ControllerOperation {
  readonly requiredParams = ['title', 'content', 'ownerEmail'];
  private useCase: UseCase;

  constructor(useCase: UseCase) {
    this.useCase = useCase;
  }

  async specificOp(request: HttpRequest): Promise<HttpResponse> {
    const noteRequest: NoteData = {
      title: request.body.title,
      content: request.body.content,
      ownerEmail: request.body.ownerEmail,
    };

    const useCaseResponse: Either<
      ExistingTitleError | UnregisteredOwnerError | InvalidTitleError,
      NoteData
    > = await this.useCase.perform(noteRequest);

    if (useCaseResponse.isRight()) {
      return created(useCaseResponse.value);
    }

    return badRequest(useCaseResponse.value);
  }
}
