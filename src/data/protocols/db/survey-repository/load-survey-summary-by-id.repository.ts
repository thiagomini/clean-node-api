import { SurveySummaryModel } from '@/domain/models'

export interface LoadSurveySummaryById {
  loadSummaryById(id: string): Promise<SurveySummaryModel>
}
