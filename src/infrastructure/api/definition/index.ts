
import { version } from './../../../../package.json';
import definitions from './definitions';
import userEndpoints from './user';
import userDefinitions from './user/definitions';

export default {
  swagger: '2.0',
  info: {
    version,
    title: 'Alpaca API',
  },
  basePath: '/',
  schemes: [ 'http', 'https' ],
  paths: {
    ...userEndpoints,
    '/public/health': {
      get: {
        operationId: 'healthCheck',
        'x-swagger-router-controller': 'health.entrypoint',
        tags: [ 'health' ],
        description: 'Checks the health of the service',
        responses: {
          200: {
            description: 'Service is healthy',
            schema: {
              $ref: '#/definitions/apiResult',
            },
          },
          500: {
            description: 'Internal server error',
            schema: {
              $ref: '#/definitions/apiResult',
            },
          },
        },
      },
    },
  },
  definitions: {
    ...definitions,
    ...userDefinitions,
  },
  parameters: {
    limit: {
      name: 'limit',
      in: 'query',
      required: false,
      default: 20,
      type: 'integer',
      description: 'number of items per page',
    },
    offset: {
      name: 'offset',
      in: 'query',
      required: false,
      default: 0,
      type: 'integer',
      description: 'numbers of items to skip',
    },
    sort: {
      name: 'sort',
      in: 'query',
      required: false,
      default: 'createdAt:DESC',
      type: 'string',
      description:
        'the field you want to sort and the order you want separate with :',
    },
  },
};
