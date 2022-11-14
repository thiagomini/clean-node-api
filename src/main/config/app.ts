import express from 'express'
import { setupSwaggerFor } from './config-swagger'
import { setupMiddlewaresFor } from './middlewares'
import { setupRoutesFor } from './routes'
import { setupStaticFilesFor } from './static-files'
const app = express()

setupStaticFilesFor(app)
setupSwaggerFor(app)
setupMiddlewaresFor(app)
setupRoutesFor(app)

export default app
