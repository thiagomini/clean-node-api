import { SurveySummaryModel } from '@/domain/models'

export interface LoadSurveySummaryByIdRepository {
  loadSummaryById(id: string): Promise<SurveySummaryModel>
}
