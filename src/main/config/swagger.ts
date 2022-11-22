import swaggerConfig from '@/main/docs'

import type { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'

export const setupSwaggerFor = (app: Express): void => {
  app.use('/docs', serve, setup(swaggerConfig))
}
