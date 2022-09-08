import { AddSurveyUseCaseError } from './add-survey.use-case.error'
import { AddSurveyInput, AddSurveyRepository, AddSurveyUseCase } from './db-add-survey.use-case.protocols'

export class DbAddSurveyUseCase implements AddSurveyUseCase {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}

  async add (surveyInput: AddSurveyInput): Promise<void> {
    try {
      await this.addSurveyRepository.add(surveyInput)
    } catch (error) {
      throw new AddSurveyUseCaseError({
        cause: error as Error,
        context: {
          surveyInput
        }
      })
    }
  }
}
