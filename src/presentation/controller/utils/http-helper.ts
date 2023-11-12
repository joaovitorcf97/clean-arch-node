import { HttpResponse } from '../ports/http-response';

export const ok = (data: any): HttpResponse => {
  return {
    statusCode: 200,
    body: data,
  };
};

export const created = (data: any): HttpResponse => {
  return {
    statusCode: 201,
    body: data,
  };
};

export const badRequest = (error: Error): HttpResponse => {
  return {
    statusCode: 400,
    body: error,
  };
};

export const forbidden = (error: Error): HttpResponse => {
  return {
    statusCode: 403,
    body: error,
  };
};

export const serverError = (error: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: error,
  };
};
