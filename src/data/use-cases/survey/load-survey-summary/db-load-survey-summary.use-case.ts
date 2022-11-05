import { SurveySummaryModel } from '../../../../domain/models'
import { NonexistentSurveyError } from '../../../../domain/use-cases/survey-result/save-survey-result/errors'
import { LoadSurveySummaryUseCase } from '../../../../domain/use-cases/survey/load-survey-summary'
import { LoadSurveySummaryByIdRepository } from '../../../protocols/db/survey-repository'

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
