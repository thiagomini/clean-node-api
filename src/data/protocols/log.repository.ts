import { ContextError } from '../../errors'

export interface LogRepository {
  error: (error: ContextError | Error) => Promise<void>
}
