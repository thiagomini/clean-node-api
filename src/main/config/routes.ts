import { Express, Router } from 'express'
import fs from 'fs'
import path from 'path'

export const setupRoutesFor = (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  fs.readdirSync(path.join(__dirname, '../routes')).filter(file => {
    return (file.indexOf('.') !== 0) && (file.endsWith('routes.ts'))
  }).map(async routeFile => {
    const route = (await import(`../routes/${routeFile}`))
    route.default(router)
  }
  )
}
