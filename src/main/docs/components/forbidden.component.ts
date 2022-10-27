export const forbidden = {
  description: 'Access Forbidden',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error',
      },
    },
  },
}
