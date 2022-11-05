import {
  LoadSurveySummaryByIdRepository,
  LoadSurveySummaryUseCase,
  LoadSurveySummaryUseCaseError,
  NonexistentSurveyError,
  Optional,
  SurveySummaryModel,
} from './db-load-survey-summary.use-case.protocols'

export class DbLoadSurveySummaryUseCase implements LoadSurveySummaryUseCase {
  constructor(
    private readonly surveyRepository: LoadSurveySummaryByIdRepository
  ) {}

  public async load(surveyId: string): Promise<SurveySummaryModel> {
    let surveySummary: Optional<SurveySummaryModel>

    try {
      surveySummary = await this.surveyRepository.loadSummaryById(surveyId)
    } catch (error) {
      throw new LoadSurveySummaryUseCaseError({
        cause: error as Error,
        context: {
          surveyId,
        },
      })
    }

    if (!surveySummary) {
      throw new NonexistentSurveyError({
        surveyId,
      })
    }

    return surveySummary
  }
}
