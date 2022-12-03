import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils'
import { defaultFieldResolver, GraphQLSchema } from 'graphql'
import { AUTH_HEADER } from '@/presentation/middlewares'
import { createAuthMiddleware } from '../../factories/middlewares/auth.middleware.factory'
import { HttpStatusCodes } from '../../../presentation/protocols'
import { ForbiddenError } from 'apollo-server-express'

export function authenticationDirectiveTransformer(
  schema: GraphQLSchema,
  directiveName: string
): GraphQLSchema {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const authenticationDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0]

      if (authenticationDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig

        // Replace the original resolver with a function that *first* checks
        // the access token, then calls the original resolver.
        fieldConfig.resolve = async function (source, args, context, info) {
          const request = {
            accessToken: context?.req?.headers?.[AUTH_HEADER],
          }

          const authMiddleware = createAuthMiddleware()
          const httpResponse = await authMiddleware.handle(request)

          if (httpResponse.statusCode === HttpStatusCodes.OK) {
            return resolve(source, args, context, info)
          }

          throw new ForbiddenError(httpResponse.body.message)
        }
      }

      return fieldConfig
    },
  })
}
