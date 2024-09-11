import { NextFunction, Request, Response } from 'express';
import httpStatusCodes from 'http-status-codes';
import AlpacaResponse from '../../../../domain/primitives/alpacaResponse';
import APIResponse, { MimeTypes } from '../response.model';
import { ServerRequest } from '../server.adapter';

export default (error, req: ServerRequest & Request, res: Response, next: NextFunction) => {
  let alpacaResponse: AlpacaResponse;
  let errors: string[];

  if (error instanceof Error) {
    alpacaResponse = new AlpacaResponse({
      statusCode: httpStatusCodes.INTERNAL_SERVER_ERROR,
      message: httpStatusCodes.getStatusText(httpStatusCodes.INTERNAL_SERVER_ERROR),
      code: 'ALPACA50000',
    });
    errors = [ error.message ];
  }
  if (error instanceof AlpacaResponse) {
    alpacaResponse = error;
  }
  if (error.code === 'SCHEMA_VALIDATION_FAILED' || error.failedValidation) {
    alpacaResponse = new AlpacaResponse({
      statusCode: httpStatusCodes.BAD_REQUEST,
      message: error.message,
      code: 'ALPACA40000',
    });
    if (error.results && error.results.errors && error.results.errors.length > 0) {
      errors = error.results.errors.map(({ message, path }) => `${path?.join('.')}: ${message}`);
    }
  }

  const response = new APIResponse(alpacaResponse, req, { errors });
  response.forceType(MimeTypes.JSON);
  response.send(res);

  next();
};
