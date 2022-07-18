import type { Express } from 'express'
import { bodyParser } from '../middlewares/body-parser.middleware'
export const setupMiddlewaresFor = (app: Express): void => {
  app.use(bodyParser)
}
