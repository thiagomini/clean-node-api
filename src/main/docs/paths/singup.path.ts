export const signUpPath = {
  post: {
    tags: ['Login'],
    summary: 'API to Sign up a user',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signUpInput',
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
        $ref: '#/components/forbidden',
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
