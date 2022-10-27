export const surveyPath = {
  get: {
    security: [
      {
        apiKeyAuth: [],
      },
    ],
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
  post: {
    security: [
      {
        apiKeyAuth: [],
      },
    ],
    tags: ['Surveys'],
    summary: 'API to create surveys',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/survey',
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Survey created',
      },
      401: {
        $ref: '#/components/unauthorized',
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
