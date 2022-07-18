import express from 'express'
import { setupMiddlewaresFor } from './middlewares'

const app = express()

setupMiddlewaresFor(app)

export default app
