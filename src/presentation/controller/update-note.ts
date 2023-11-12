import { InvalidTitleError } from '@/entities/errors/invalid-title-error';
import { Either } from '@/shared/either';
import { ExistingTitleError } from '@/use-cases/create-note/errors/existing-title-error';
import { NoteData } from '@/use-cases/ports/node-data';
import { UseCase } from '@/use-cases/ports/use-case';
import { MissingParamError } from './errors/missing-param-error';
import { ControllerOperation } from './ports/controller-operation';
import { HttpResponse } from './ports/http-response';
import { HttpRequest } from './ports/http-resquest';
import { badRequest, ok } from './utils/http-helper';
import { WebController } from './web-controller';

export class UpdateNoteOperation implements ControllerOperation {
  readonly requiredParams = ['id', 'ownerEmail', 'ownerId'];
  private useCase: UseCase;

  constructor(useCase: UseCase) {
    this.useCase = useCase;
  }

  async specificOp(request: HttpRequest): Promise<HttpResponse> {
    const updateParams = ['title', 'content'];
    const missingUpdateParams: string = WebController.getMissingParams(
      request,
      updateParams
    );

    if (missingTitleAndContent(request.body)) {
      return badRequest(new MissingParamError(missingUpdateParams));
    }

    const useCaseResponse: Either<
      ExistingTitleError | InvalidTitleError,
      NoteData
    > = await this.useCase.perform(request.body);

    if (useCaseResponse.isRight()) {
      return ok(useCaseResponse.value);
    }

    return badRequest(useCaseResponse.value);
  }
}

function missingTitleAndContent(missingUpdateParams: string): boolean {
  return missingUpdateParams.split(',').length === 2;
}
