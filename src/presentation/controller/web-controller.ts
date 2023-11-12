import { MissingParamError } from './errors/missing-param-error';
import { ControllerOperation } from './ports/controller-operation';
import { HttpResponse } from './ports/http-response';
import { HttpRequest } from './ports/http-resquest';
import { badRequest, serverError } from './utils/http-helper';

export class WebController {
  private controllerOp: ControllerOperation;

  constructor(controllerOp: ControllerOperation) {
    this.controllerOp = controllerOp;
  }

  public async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const missingParams: string = WebController.getMissingParams(
        request,
        this.controllerOp.requiredParams
      );

      if (missingParams) {
        return badRequest(new MissingParamError(missingParams));
      }

      return await this.controllerOp.specificOp(request);
    } catch (error: any) {
      return serverError(error);
    }
  }

  public static getMissingParams(
    request: HttpRequest,
    requiredParams: string[]
  ): string {
    const missingParams: string[] = [];

    requiredParams.forEach((name) => {
      if (!Object.keys(request.body).includes(name)) {
        missingParams.push(name);
      }
    });

    return missingParams.join(', ');
  }
}
