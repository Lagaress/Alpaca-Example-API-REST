import { RequestHandler } from 'express';
import { Response } from 'express-serve-static-core';
import http, { IncomingMessage } from 'http';
import { SwaggerRequestParameters } from 'swagger-tools';
import config from '../../../config';
import { Dependencies } from '../../../container';
import AlpacaResponse from '../../../domain/primitives/alpacaResponse';
import { InternalError } from '../../../domain/primitives/exceptions';
import LoggerInterface from '../../../domain/primitives/logger.interface';
import errorMiddleware from './middlewares/error.middleware';
import loggerMiddleware from './middlewares/logger.middleware';
import requestID from './middlewares/requestId.middleware';
import sanitizerMiddleware from './middlewares/sanitizer.middleware';
import swaggerParamsMiddleware from './middlewares/swaggerParams.middleware';
import { getParams } from './model/params.model';
import APIResponse, { MimeTypes } from './response.model';

export enum Environment {
  DEV = 'DEV',
  PRO = 'PRO'
}

type ServerConfig = {
  port: number;
  sslPort?: number;
  host: string,
  controllersPath: string;
  apiDefinition;
  middlewares?: { path: string, handler: RequestHandler }[];
}

export type ServerRequest = Express.Request & IncomingMessage & {
  swagger: {
    params: SwaggerRequestParameters;
    operation: {
      produces: MimeTypes[];
      operationId: string;
      'x-swagger-router-controller': string;
    };
  };
  params: Record<string, unknown>;
  body: Record<string, unknown>;
  query: Record<string, unknown>;
  headers: Record<string, unknown>;
  logger: LoggerInterface;
  id: string;
};

type Handler<T> = (req: ServerRequest, res: Response) => Promise<T>;

function getChildLog(req: ServerRequest): LoggerInterface {
  return req.logger.child({
    entrypoint: req.swagger?.operation?.['x-swagger-router-controller'],
    operation: req.swagger?.operation?.operationId,
    referer: req.headers.referer,
  });
}

function buildResponseFromError(error: unknown, req: ServerRequest, childLog: LoggerInterface): APIResponse {
  if (error instanceof AlpacaResponse) {
    childLog.debug({ error }, 'Error executing controller');
    return new APIResponse(error, req);
  } else {
    const params = JSON.stringify(getParams(req));
    childLog.fatal({ error, params }, 'Unhandled error executing controller');
    return new APIResponse(InternalError, req);
  }
}

export const requestHandler = (fn: Handler<APIResponse>) => async (req: ServerRequest, res: Response) => {
  const childLog = getChildLog(req);
  childLog.debug('Executing');
  let response: APIResponse;
  try {
    response = await fn(req, res);
    childLog.debug('Executed correctly');
  } catch (error) {
    response = buildResponseFromError(error, req, childLog);
  } finally {
    res.status(response.statusCode).json(response.build());
  }
};

export default ({
  express,
  swaggerTools,
  logger,
  cors,
  helmet,
}: Dependencies) => {
  const app = express() as any;
  return (serverConfig: ServerConfig) => {
    const options = {
      controllers: serverConfig.controllersPath,
    };

    const CORS_CONFIG = {
      origin: config.SERVER.CORS.WHITELIST,
      credentials: config.SERVER.CORS.CREDENTIALS,
      maxAge: config.SERVER.CORS.MAX_AGE,
    };

    const server = http.createServer(app);
    
    swaggerTools.initializeMiddleware(serverConfig.apiDefinition, function (middleware) {
      app.use(cors(CORS_CONFIG));
      app.use(middleware.swaggerMetadata());
      app.use(requestID());
      app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
      }));
      app.use(loggerMiddleware(logger));
      app.use(middleware.swaggerValidator());
      app.use(sanitizerMiddleware);
      app.use(swaggerParamsMiddleware);
      app.use(middleware.swaggerRouter(options));
      app.use(errorMiddleware);
      app.use(middleware.swaggerUi());

      serverConfig.middlewares?.forEach(({ path, handler }) => app.use(path, handler));
      server.listen(serverConfig.port, serverConfig.host);

      logger.debug(`Your server is listening on port ${serverConfig.port} (http://${serverConfig.host}:${serverConfig.port})`);
      logger.debug(`Swagger-ui is available on http://${serverConfig.host}:${serverConfig.port}/docs`);
    });
  };
};
