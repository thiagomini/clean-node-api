import {
  NonexistentAccountError,
  NonexistentSurveyError,
} from '../../../domain/use-cases/save-survey-result/errors'
import {
  CreateOrUpdateSurveyResultRepository,
  SaveSurveyResultInput,
  SaveSurveyResultUseCase,
} from './db-save-survey-result.protocols'
import { SaveSurveyResultUseCaseError } from './errors/'

export class DbSaveSurveyResultUseCase implements SaveSurveyResultUseCase {
  constructor(
    private readonly createOrUpdateSurveyRepository: CreateOrUpdateSurveyResultRepository
  ) {}

  async save(saveSurveyResultInput: SaveSurveyResultInput): Promise<void> {
    try {
      await this.createOrUpdateSurveyRepository.createOrUpdateResult(
        saveSurveyResultInput
      )
    } catch (err) {
      if (err instanceof NonexistentSurveyError) {
        throw err
      }

      if (err instanceof NonexistentAccountError) {
        throw err
      }

      throw new SaveSurveyResultUseCaseError({
        cause: err as Error,
        saveSurveyResultInput,
      })
    }
  }
}
