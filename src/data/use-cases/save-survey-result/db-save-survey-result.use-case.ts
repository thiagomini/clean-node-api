import {
  CreateOrUpdateSurveyResultRepository,
  SaveSurveyResultInput,
  SaveSurveyResultUseCase,
} from './db-save-survey-result.protocols'

export class DbSaveSurveyResultUseCase implements SaveSurveyResultUseCase {
  constructor(
    private readonly createOrUpdateSurveyRepository: CreateOrUpdateSurveyResultRepository
  ) {}

  async save(surveyResultInput: SaveSurveyResultInput): Promise<void> {
    await this.createOrUpdateSurveyRepository.createOrUpdate(surveyResultInput)
  }
}
