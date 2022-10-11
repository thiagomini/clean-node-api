import {
  FindSurveyByIdRepository,
  FindSurveyByIdUseCase,
  FindSurveyByIdUseCaseError,
  Optional,
  SurveyModel,
  SurveyNotFoundError,
} from './find-survey-by-id.protocols'

export class DbFindSurveyByIdUseCase implements FindSurveyByIdUseCase {
  constructor(
    private readonly findSurveyByIdRepository: FindSurveyByIdRepository
  ) {}
  async findById(id: string): Promise<SurveyModel> {
    let surveyOrUndefined: Optional<SurveyModel>

    try {
      surveyOrUndefined = await this.findSurveyByIdRepository.findById(id)
    } catch (err) {
      throw new FindSurveyByIdUseCaseError(id)
    }

    if (!surveyOrUndefined) {
      throw new SurveyNotFoundError(id)
    }

    return surveyOrUndefined
  }
}
