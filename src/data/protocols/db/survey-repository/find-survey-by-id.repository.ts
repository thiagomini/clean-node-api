import { SurveyModel } from '@/domain/models'
import { Optional } from '@/utils'

export interface FindSurveyByIdRepository {
  findById(id: string): Promise<Optional<SurveyModel>>
}
