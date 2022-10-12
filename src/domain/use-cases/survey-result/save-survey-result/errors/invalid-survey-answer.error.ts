import { ContextError, ContextErrorInput } from '@/errors'
import { SurveyModel } from '../../../../models'

export interface InvalidSurveyAnswerErrorInput
  extends Omit<ContextErrorInput, 'message' | 'errorName'> {
  answers: SurveyModel['answers']
  answer: string
}

export class InvalidSurveyAnswerError extends ContextError {
  constructor(errorInput: InvalidSurveyAnswerErrorInput) {
    super({
      ...errorInput,
      message: `Survey asnwer ${
        errorInput.answer
      } is invalid. Please provide one of the following values: [${errorInput.answers.toString()}]`,
      errorName: InvalidSurveyAnswerError.name,
    })
  }
}
