import {
  LoadSurveySummaryByIdRepository,
  LoadSurveySummaryUseCase,
  LoadSurveySummaryUseCaseError,
  NonexistentSurveyError,
  SurveySummaryModel,
} from './db-load-survey-summary.use-case.protocols'

export class DbLoadSurveySummaryUseCase implements LoadSurveySummaryUseCase {
  constructor(
    private readonly surveyRepository: LoadSurveySummaryByIdRepository
  ) {}

  public async load(surveyId: string): Promise<SurveySummaryModel> {
    try {
      const surveySummary = await this.surveyRepository.loadSummaryById(
        surveyId
      )

      if (!surveySummary) {
        throw new NonexistentSurveyError({
          surveyId,
        })
      }

      return surveySummary
    } catch (error) {
      if (error instanceof NonexistentSurveyError) {
        throw error
      }

      throw new LoadSurveySummaryUseCaseError({
        cause: error as Error,
        context: {
          surveyId,
        },
      })
    }
  }
}
