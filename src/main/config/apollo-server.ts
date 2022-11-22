import type { Express } from 'express'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from '@/main/graphql/type-defs'
import resolvers from '@/main/graphql/resolvers'

export const setupApolloServerFor = async (app: Express): Promise<void> => {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
  })

  await server.start()
  server.applyMiddleware({ app })
}
