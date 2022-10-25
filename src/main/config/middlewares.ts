import type { Express } from 'express'
import { bodyParser, cors, contentType, noCache } from '../middlewares'

export const setupMiddlewaresFor = (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
  app.use(noCache)
}
