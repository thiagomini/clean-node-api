import { SurveySummaryModel } from '@/domain/models'

export interface LoadSurveySummaryUseCase {
  load(surveyId: string): Promise<SurveySummaryModel>
}
