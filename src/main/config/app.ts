import express from 'express'
import { setupSwaggerFor } from './swagger'
import { setupMiddlewaresFor } from './middlewares'
import { setupRoutesFor } from './routes'
import { setupStaticFilesFor } from './static-files'
import { setupApolloServerFor } from './apollo-server'
const app = express()

setupApolloServerFor(app).catch((err) => {
  console.error(err)
})
setupStaticFilesFor(app)
setupSwaggerFor(app)
setupMiddlewaresFor(app)
setupRoutesFor(app)

export default app
