export default {
  '/users': {
    post: {
      operationId: 'create',
      'x-swagger-router-controller': 'user.entrypoint',
      tags: [
        'users',
      ],
      description: 'Creates a new user',
      parameters: [
        {
          name: 'data',
          in: 'body',
          required: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: [ 'email', 'nickname' ],
            properties: {
              email: {
                description: 'User email',
                type: 'string',
                example: 'johndoe@example.com',
              },
              nickname: {
                description: 'User nickname',
                type: 'string',
                example: 'johndoe',
              },
            },
          },
        },
      ],
      responses: {
        201: {
          description: 'User created successfully',
          schema: {
            $ref: '#/definitions/userResponse',
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
    get: {
      operationId: 'getAll',
      'x-swagger-router-controller': 'user.entrypoint',
      tags: [
        'users',
      ],
      description: 'Retrieves all users',
      parameters: [
        {
          name: 'nickname',
          in: 'query',
          type: 'string',
          description: 'User nickname',
        },
        {
          name: 'email',
          in: 'query',
          type: 'string',
          description: 'User email',
        },
        { $ref: '#/parameters/limit' },
        { $ref: '#/parameters/offset' },
      ],
      responses: {
        200: {
          description: 'Users retrieved successfully',
          schema: {
            $ref: '#/definitions/userPaginatedResponse',
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

  '/users/{userId}': {
    parameters: [
      {
        name: 'userId',
        in: 'path',
        required: true,
        type: 'number',
        description: 'User id',
      },
    ],
    get: {
      operationId: 'get',
      'x-swagger-router-controller': 'user.entrypoint',
      tags: [
        'users',
      ],
      description: 'Retrieves a user by id',
      responses: {
        200: {
          description: 'User retrieved successfully',
          schema: {
            $ref: '#/definitions/userResponse',
          },
        },
        404: {
          description: 'User not found',
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
    patch: {
      operationId: 'update',
      'x-swagger-router-controller': 'user.entrypoint',
      tags: [
        'users',
      ],
      description: 'Updates a user by id',
      parameters: [
        {
          name: 'data',
          in: 'body',
          required: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              email: {
                description: 'User email',
                type: 'string',
                example: 'johndoe@example.com',
              },
              nickname: {
                description: 'User nickname',
                type: 'string',
                example: 'johndoe',
              },
            },
          },
        },
      ],
      responses: {
        202: {
          description: 'User updated successfully',
          schema: {
            $ref: '#/definitions/userResponse',
          },
        },
        404: {
          description: 'User not found',
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
    delete: {
      operationId: 'delete',
      'x-swagger-router-controller': 'user.entrypoint',
      tags: [
        'users',
      ],
      description: 'Deletes a user by id',
      responses: {
        204: {
          description: 'User deleted successfully',
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
};

