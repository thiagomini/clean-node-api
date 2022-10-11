import { ContextError, ContextErrorInput } from '@/errors'

export class FindSurveyByIdUseCaseError extends ContextError {
  constructor(id: string) {
    super({
      message: `An Error occurred while trying to find a survey with id ${id}`,
      errorName: FindSurveyByIdUseCaseError.name,
      context: {
        surveyId: id,
      },
    })
  }
}
