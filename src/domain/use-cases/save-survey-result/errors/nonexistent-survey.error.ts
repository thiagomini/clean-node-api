import { ContextError, ContextErrorInput } from '@/errors'

export interface NonexistentSurveyErrorInput
  extends Omit<ContextErrorInput, 'message' | 'errorName'> {
  surveyId: string
}

export class NonexistentSurveyError extends ContextError {
  constructor(errorInput: NonexistentSurveyErrorInput) {
    super({
      ...errorInput,
      message: `Survey with id ${errorInput.surveyId} does not exist`,
      errorName: NonexistentSurveyError.name,
    })
  }
}
