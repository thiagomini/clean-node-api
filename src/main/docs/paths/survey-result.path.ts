export const surveyResultPath = {
  put: {
    security: [
      {
        apiKeyAuth: [],
      },
    ],
    tags: ['Surveys'],
    summary: 'API to answer a survey',
    parameters: [
      {
        in: 'path',
        name: 'surveyId',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/surveyResultInput',
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Survey Result created',
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
