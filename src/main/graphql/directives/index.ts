import { GraphQLSchema } from 'graphql'
import { authenticationDirectiveTransformer } from './auth.directive'

export default [
  (schema: GraphQLSchema) => authenticationDirectiveTransformer(schema, 'auth'),
]
