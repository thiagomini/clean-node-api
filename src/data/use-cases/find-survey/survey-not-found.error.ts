import { ContextError, ContextErrorInput } from '@/errors'

export class SurveyNotFoundError extends ContextError {
  constructor(id: string) {
    super({
      message: `Survey with id ${id} was not found`,
      errorName: SurveyNotFoundError.name,
      context: {
        surveyId: id,
      },
    })
  }
}
