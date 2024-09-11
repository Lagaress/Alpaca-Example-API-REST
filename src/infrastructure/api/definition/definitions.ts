export default {
  apiResult: {
    type: 'object',
    properties: {
      result: {
        type: 'object',
        properties: {
          code: {
            description: 'The unique code of the response',
            type: 'string',
            example: 'ALPACA40001',
          },
          requestId: {
            description: 'The unique identifier for the request',
            type: 'string',
            format: 'uuid',
            example: '8c8ff55c-11f5-4b3c-8596-3d9831a8934d',
          },
          message: {
            description: 'The response message in a human format',
            type: 'string',
            example: 'Request message response',
          },
        },
      },
    },
  },

  paginationInformation: {
    type: 'object',
    properties: {
      total: {
        description: 'Total entities retrieved in data',
        type: 'number',
        example: 3,
      },
      limit: {
        description: 'Maximum number of returned entities',
        type: 'number',
        example: 20,
      },
      offset: {
        description: 'Numbers of entities omitted',
        type: 'number',
        example: 0,
      },
    },
  },
};
