import 'module-alias/register'
import 'dotenv/config'
import env from './config/env'
import { mongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

mongoHelper
  .connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(env.port, () =>
      console.log(`Server running at http://localhost:${env.port}`)
    )
  })
  .catch(console.error)
