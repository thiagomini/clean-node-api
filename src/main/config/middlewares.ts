import type { Express } from 'express'
import { bodyParser } from '../middlewares/body-parser.middleware'
import { cors } from '../middlewares/cors.middleware'
export const setupMiddlewaresFor = (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
}
