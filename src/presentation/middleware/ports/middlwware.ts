import { HttpResponse } from '@/presentation/controller/ports/http-response';

export interface Middleware<T = any> {
  handle: (httRequest: T) => Promise<HttpResponse>;
}
