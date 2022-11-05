import {
  LoadSurveySummaryByIdRepository,
  LoadSurveySummaryUseCase,
  NonexistentSurveyError,
  SurveySummaryModel,
} from './db-load-survey-summary.use-case.protocols'

export class DbLoadSurveySummaryUseCase implements LoadSurveySummaryUseCase {
  constructor(
    private readonly surveyRepository: LoadSurveySummaryByIdRepository
  ) {}

  public async load(surveyId: string): Promise<SurveySummaryModel> {
    const surveySummary = await this.surveyRepository.loadSummaryById(surveyId)

    if (!surveySummary) {
      throw new NonexistentSurveyError({
        surveyId,
      })
    }

    return surveySummary
  }
}
