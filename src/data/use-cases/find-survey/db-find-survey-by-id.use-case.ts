import { FindSurveyByIdUseCase } from '@/domain/use-cases/find-survey'
import { FindSurveyByIdRepository } from '@/data/protocols/db/survey-repository/find-survey-by-id.repository'
import { SurveyModel } from '../add-survey/db-add-survey.use-case.protocols'
import { FindSurveyByIdUseCaseError } from './find-survey-by-id.use-case.error'
import { SurveyNotFoundError } from './survey-not-found.error'

export class DbFindSurveyByIdUseCase implements FindSurveyByIdUseCase {
  constructor(
    private readonly findSurveyByIdRepository: FindSurveyByIdRepository
  ) {}
  async findById(id: string): Promise<SurveyModel> {
    try {
      const surveyOrUndefined = await this.findSurveyByIdRepository.findById(id)
      if (!surveyOrUndefined) {
        throw new SurveyNotFoundError(id)
      }
    } catch (err) {
      if (err instanceof SurveyNotFoundError) {
        throw err
      }

      throw new FindSurveyByIdUseCaseError(id)
    }

    return {
      answers: [],
      createdAt: new Date(),
      id: '',
      question: '',
    }
  }
}
