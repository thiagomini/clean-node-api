import { AddSurveyInput, AddSurveyRepository, AddSurveyUseCase } from './db-add-survey.use-case.protocols'

export class DbAddSurveyUseCase implements AddSurveyUseCase {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}

  async add (surveyInput: AddSurveyInput): Promise<void> {
    await this.addSurveyRepository.add(surveyInput)
  }
}
