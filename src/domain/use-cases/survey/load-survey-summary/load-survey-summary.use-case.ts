import { SurveySummaryModel } from '@/domain/models'

/**
 * @throws {NonexistentSurveyError} when the survey with given id does not exist.
 */
export interface LoadSurveySummaryUseCase {
  load(surveyId: string): Promise<SurveySummaryModel>
}
