import { ContextError, ContextErrorInput } from '@/errors'

export type LoadSurveySummaryUseCaseErrorInput = Pick<
  ContextErrorInput,
  'cause' | 'context'
>

export class LoadSurveySummaryUseCaseError extends ContextError {
  constructor(errorInput: LoadSurveySummaryUseCaseErrorInput) {
    super({
      message: 'An Error occurred while trying to load a survey summary',
      errorName: LoadSurveySummaryUseCaseError.name,
      ...errorInput,
    })
  }
}
