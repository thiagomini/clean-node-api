import { ContextError, ContextErrorInput } from '../../../errors'

export type AddSurveyUseCaseErrorInput = Pick<
  ContextErrorInput,
  'cause' | 'context'
>

export class AddSurveyUseCaseError extends ContextError {
  constructor(errorInput: AddSurveyUseCaseErrorInput) {
    super({
      message: 'An Error occurred while trying to add a survey',
      errorName: AddSurveyUseCaseError.name,
      ...errorInput,
    })
  }
}
