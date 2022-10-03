import {
  CreateOrUpdateSurveyResultRepository,
  SaveSurveyResultInput,
  SaveSurveyResultUseCase,
} from './db-save-survey-result.protocols'
import { SaveSurveyResultUseCaseError } from './save-survey-result.use-case.error'

export class DbSaveSurveyResultUseCase implements SaveSurveyResultUseCase {
  constructor(
    private readonly createOrUpdateSurveyRepository: CreateOrUpdateSurveyResultRepository
  ) {}

  async save(saveSurveyResultInput: SaveSurveyResultInput): Promise<void> {
    try {
      await this.createOrUpdateSurveyRepository.createOrUpdate(
        saveSurveyResultInput
      )
    } catch (err) {
      throw new SaveSurveyResultUseCaseError({
        cause: err as Error,
        saveSurveyResultInput,
      })
    }
  }
}
