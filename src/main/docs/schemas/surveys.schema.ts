export const surveysSchema = {
  type: 'object',
  properties: {
    surveys: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: {
            type: 'string',
          },
          answers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                image: {
                  type: 'string',
                },
                answer: {
                  type: 'string',
                  required: false,
                },
              },
            },
          },
        },
      },
    },
  },
}
