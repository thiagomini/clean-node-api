import { SurveyModel } from '../../models'

export interface LoadSurveysUseCase {
  load(): Promise<SurveyModel[]>
}
