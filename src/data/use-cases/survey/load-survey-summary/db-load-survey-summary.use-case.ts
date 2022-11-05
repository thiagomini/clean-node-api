import { SurveySummaryModel } from '../../../../domain/models'
import { LoadSurveySummaryUseCase } from '../../../../domain/use-cases/survey/load-survey-summary'
import { LoadSurveySummaryByIdRepository } from '../../../protocols/db/survey-repository'

export class DbLoadSurveySummaryUseCase implements LoadSurveySummaryUseCase {
  constructor(
    private readonly surveyRepository: LoadSurveySummaryByIdRepository
  ) {}

  public async load(surveyId: string): Promise<SurveySummaryModel> {
    const surveySummary = await this.surveyRepository.loadSummaryById(surveyId)

    return surveySummary
  }
}
