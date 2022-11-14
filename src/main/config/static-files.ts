import express, { Express } from 'express'
import { resolve } from 'path'

export const setupStaticFilesFor = (app: Express): void => {
  const staticFilesPath = resolve(__dirname, '../../static')
  app.use('/static', express.static(resolve(staticFilesPath)))
}
