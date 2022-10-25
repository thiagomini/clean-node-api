import express from 'express'
import { setupSwaggerFor } from './config-swagger'
import { setupMiddlewaresFor } from './middlewares'
import { setupRoutesFor } from './routes'
const app = express()

setupSwaggerFor(app)
setupMiddlewaresFor(app)
setupRoutesFor(app)

export default app
