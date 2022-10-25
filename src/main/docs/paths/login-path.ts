export const loginPath = {
  post: {
    tags: ['Login'],
    summary: 'API to authenticate user',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/loginInput',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/account',
            },
          },
        },
      },
      401: {
        description: 'Unauthorized',
      },
      400: {
        description: 'Bad Request',
      },
    },
  },
}
