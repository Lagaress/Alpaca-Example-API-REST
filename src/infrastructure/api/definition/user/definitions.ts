export default {
  user: {
    type: 'object',
    properties: {
      id: {
        description: 'User ID',
        type: 'number',
        example: 53,
      },
      email: {
        description: 'User email',
        type: 'string',
        example: 'john.doe@example.com',
      },
      nickname: {
        description: 'User nickname',
        type: 'string',
        example: 'John Doe',
      },
      createdAt: {
        description: 'The date when the user was created',
        type: 'string',
        example: '2020-01-13 09:45:01',
      },
      updatedAt: {
        description: 'The date when the user was updated',
        type: 'string',
        example: '2020-01-13 09:45:01',
      },
    },
  },

  userResponse: {
    allOf: [
      {
        $ref: '#/definitions/apiResult',
      },
      {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            $ref: '#/definitions/user',
          },
        },
      },
    ],
  },

  userPaginatedResponse: {
    allOf: [
      {
        $ref: '#/definitions/apiResult',
      },
      {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            properties: {
              data: {
                type: 'array',
                items: {
                  $ref: '#/definitions/user',
                },
              },
            },
          },
          extra: {
            type: 'object',
            $ref: '#/definitions/paginationInformation',
          },
        },
      },
    ],
  },
};
