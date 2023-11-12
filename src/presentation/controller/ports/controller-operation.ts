import { HttpResponse } from './http-response';
import { HttpRequest } from './http-resquest';

export interface ControllerOperation {
  readonly requiredParams: string[];
  specificOp(request: HttpRequest): Promise<HttpResponse>;
}
