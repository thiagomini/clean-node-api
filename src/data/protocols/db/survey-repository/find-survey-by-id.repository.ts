import { SurveyModel } from '@/domain/models'

export interface FindSurveyByIdRepository {
  findById(id: string): Promise<SurveyModel>
}
