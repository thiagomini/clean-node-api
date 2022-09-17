import { Express, Router } from 'express'
import fs from 'fs'
import path from 'path'

export const setupRoutesFor = (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  fs.readdirSync(path.join(__dirname, '../routes'))
    .filter(fileIsRouteHandler)
    .map(async (routeFile) => {
      const route = await import(`../routes/${routeFile}`)
      route.default(router)
    })
}

const fileIsRouteHandler = (fileName: string): boolean =>
  fileName.indexOf('.') !== 0 &&
  (fileName.endsWith('routes.ts') || fileName.endsWith('routes.js'))
