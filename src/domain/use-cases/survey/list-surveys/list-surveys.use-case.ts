import { SurveyModel } from '../../../models'

export interface LoadSurveysUseCase {
  list(): Promise<SurveyModel[]>
}
