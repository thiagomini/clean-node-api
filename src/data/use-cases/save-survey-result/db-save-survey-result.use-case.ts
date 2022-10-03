import {
  SaveSurveyResultInput,
  SaveSurveyResultUseCase,
} from '../../../domain/use-cases/save-survey-result'
import { CreateOrUpdateSurveyResultRepository } from '../../protocols/db/survey-result-repository'

export class DbSaveSurveyResultUseCase implements SaveSurveyResultUseCase {
  constructor(
    private readonly createOrUpdateSurveyRepository: CreateOrUpdateSurveyResultRepository
  ) {}

  async save(surveyResultInput: SaveSurveyResultInput): Promise<void> {
    await this.createOrUpdateSurveyRepository.createOrUpdate(surveyResultInput)
  }
}
