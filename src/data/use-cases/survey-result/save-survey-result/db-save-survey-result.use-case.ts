import {
  NonexistentAccountError,
  NonexistentSurveyError,
} from '@/domain/use-cases/survey-result/save-survey-result/errors'
import { FindSurveyByIdRepository } from '../../survey/find-survey/find-survey-by-id.protocols'
import {
  CreateOrUpdateSurveyResultRepository,
  LoadAccountByIdRepository,
  SaveSurveyResultInput,
  SaveSurveyResultUseCase,
} from './db-save-survey-result.protocols'
import { SaveSurveyResultUseCaseError } from './errors/'

export class DbSaveSurveyResultUseCase implements SaveSurveyResultUseCase {
  constructor(
    private readonly createOrUpdateSurveyRepository: CreateOrUpdateSurveyResultRepository,
    private readonly findSurveyByIdRepository: FindSurveyByIdRepository,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository
  ) {}

  async save(saveSurveyResultInput: SaveSurveyResultInput): Promise<void> {
    try {
      await this.saveSurveyResultOrFail(saveSurveyResultInput)
    } catch (err) {
      this.handleSaveError(err as Error, saveSurveyResultInput)
    }
  }

  private async saveSurveyResultOrFail(
    saveSurveyResultInput: SaveSurveyResultInput
  ): Promise<void> {
    const survey = await this.findSurveyByIdRepository.findById(
      saveSurveyResultInput.surveyId
    )

    if (!survey) {
      throw new NonexistentSurveyError({
        surveyId: saveSurveyResultInput.surveyId,
        context: {
          saveSurveyResultInput,
        },
      })
    }

    const account = await this.loadAccountByIdRepository.loadById(
      saveSurveyResultInput.accountId
    )

    if (!account) {
      throw new NonexistentAccountError({
        accountId: saveSurveyResultInput.accountId,
        context: {
          saveSurveyResultInput,
        },
      })
    }

    await this.createOrUpdateSurveyRepository.createOrUpdate(
      saveSurveyResultInput
    )
  }

  private handleSaveError(
    error: Error,
    saveSurveyResultInput: SaveSurveyResultInput
  ): never {
    if (this.isUnknownError(error)) {
      throw new SaveSurveyResultUseCaseError({
        cause: error as Error,
        saveSurveyResultInput,
      })
    }

    throw error
  }

  private isUnknownError(error: Error): boolean {
    return ![
      NonexistentAccountError.name,
      NonexistentSurveyError.name,
    ].includes(error.name)
  }
}
