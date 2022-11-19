import { LogMongoRepository } from '@/infra/db/mongodb/repositories/log-mongo.repository'
import { Controller } from '@/presentation/protocols'
import { LogDecoratorController } from '../../decorators/log.decorator'

export const decorateWithLogger = (
  controller: Controller
): LogDecoratorController => {
  const logErrorRepository = new LogMongoRepository()
  const logDecoratorController = new LogDecoratorController(
    controller,
    logErrorRepository
  )

  return logDecoratorController
}
