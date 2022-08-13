import { ContextError } from '../../../../errors'

export interface LogErrorRepository {
  error: (error: ContextError | Error) => Promise<void>
}
