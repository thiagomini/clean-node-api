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
      403: {
        $ref: '#/components/unauthorized',
      },
      400: {
        $ref: '#/components/badRequest',
      },
      500: {
        $ref: '#/components/internalServerError',
      },
    },
  },
}
