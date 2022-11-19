import { LogErrorRepository } from '@/data/protocols/db/log-repository'

export const createStubLogRepository = (): LogErrorRepository => {
  class StubLogRepository implements LogErrorRepository {
    async error(): Promise<void> {}
  }

  return new StubLogRepository()
}
