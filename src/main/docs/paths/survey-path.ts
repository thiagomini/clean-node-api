export const surveyPath = {
  get: {
    tags: ['Surveys'],
    summary: 'API to list surveys',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys',
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
