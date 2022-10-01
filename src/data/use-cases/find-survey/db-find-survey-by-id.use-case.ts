import { FindSurveyByIdUseCase } from '@/domain/use-cases/find-survey'
import { FindSurveyByIdRepository } from '@/data/protocols/db/survey-repository/find-survey-by-id.repository'
import { SurveyModel } from '../add-survey/db-add-survey.use-case.protocols'
import { FindSurveyByIdUseCaseError } from './find-survey-by-id.use-case.error'

export class DbFindSurveyByIdUseCase implements FindSurveyByIdUseCase {
  constructor(
    private readonly findSurveyByIdRepository: FindSurveyByIdRepository
  ) {}
  async findById(id: string): Promise<SurveyModel> {
    try {
      await this.findSurveyByIdRepository.findById(id)
    } catch (err) {
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
