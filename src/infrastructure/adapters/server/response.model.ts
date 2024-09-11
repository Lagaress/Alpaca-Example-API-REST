import httpStatusCodes from 'http-status-codes';
import AlpacaResponse from '../../../domain/primitives/alpacaResponse';
import { ServerRequest } from './server.adapter';

type Payload = {
  result: {
    code: string;
    message: string;
    requestId: string;
    errors?: string[];
  },
  data?: unknown;
  extra?: unknown;
}

type ExtraParams = { data?: unknown; extra?: unknown; errors?: string[] };
export enum MimeTypes {
  JSON = 'application/json',
}

export default class APIResponse {
  private defaultType: MimeTypes = MimeTypes.JSON;

  public statusCode: number;
  public internalCode: string;
  public requestId: string;
  public message: string;
  public data: unknown;
  public extra: unknown;
  public errors: string[];
  public request: ServerRequest;
  public forcedType: MimeTypes;

  public constructor(response: AlpacaResponse, request: ServerRequest, extra: ExtraParams = {}) {
    this.statusCode = response.statusCode || httpStatusCodes.INTERNAL_SERVER_ERROR;
    this.internalCode = response.code || `${this.statusCode}00`;
    this.requestId = request.id;
    this.message = response.message;
    this.data = extra.data;
    this.extra = extra.extra;
    this.errors = extra.errors || [];
    this.request = request;
  }

  private handlers: Record<MimeTypes, () => Payload | string> = {
    [ MimeTypes.JSON ]: () => {
      const response: Payload = {
        result: {
          code: this.internalCode,
          message: this.message,
          requestId: this.requestId,
        },
        data: this.data,
        extra: this.extra,
      };
      if (this.errors.length > 0) {
        response.result.errors = this.errors;
      }
      return response;
    },
  };

  public forceType(type: MimeTypes): void {
    this.forcedType = type;
  }

  public get mimeType(): MimeTypes {
    const mimeTypes = this.request?.swagger?.operation?.produces || [];
    const requiredContent = this.forcedType || this.request?.headers?.accept;
    return mimeTypes.find(mimeType => mimeType === requiredContent) || this.defaultType;
  }

  public build(): Payload | string {
    const responseType = this.mimeType;
    return this.handlers[responseType] ? this.handlers[responseType]() : this.handlers[this.defaultType]();
  }

  public send(res): void {
    if (this.mimeType === MimeTypes.JSON) {
      res.status(this.statusCode).json(this.build());
    }
  }
}
