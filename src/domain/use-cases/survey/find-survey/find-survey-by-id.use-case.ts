import { SurveyModel } from '../../../models'

export interface FindSurveyByIdUseCase {
  findById(id: string): Promise<SurveyModel>
}
