import express from 'express'
import { setupMiddlewaresFor } from './middlewares'
import { setupRoutesFor } from './routes'
const app = express()

setupMiddlewaresFor(app)
setupRoutesFor(app)

export default app
