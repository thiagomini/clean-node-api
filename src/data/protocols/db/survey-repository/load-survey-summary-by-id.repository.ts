import { SurveySummaryModel } from '@/domain/models'
import { Optional } from '@/utils'

export interface LoadSurveySummaryByIdRepository {
  loadSummaryById(id: string): Promise<Optional<SurveySummaryModel>>
}
