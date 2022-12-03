import type { Express } from 'express'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from '@/main/graphql/type-defs'
import resolvers from '@/main/graphql/resolvers'
import directives from '@/main/graphql/directives'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { GraphQLSchema } from 'graphql'

export const setupApolloServerFor = async (app: Express): Promise<void> => {
  const schema = makeExecutableSchema({
    resolvers,
    typeDefs,
  })

  const schemaWithDirectives = applyDirectivesTo(schema)

  const server = new ApolloServer({
    schema: schemaWithDirectives,
    context: ({ req }) => ({ req }),
  })

  await server.start()
  server.applyMiddleware({ app })
}

function applyDirectivesTo(schema: GraphQLSchema): GraphQLSchema {
  return directives.reduce(
    (resultSchema, directive) => directive(resultSchema),
    schema
  )
}
