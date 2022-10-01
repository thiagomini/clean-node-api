import { FindSurveyByIdUseCase } from '@/domain/use-cases/find-survey'
import { FindSurveyByIdRepository } from '@/data/protocols/db/survey-repository/find-survey-by-id.repository'
import { SurveyModel } from '../add-survey/db-add-survey.use-case.protocols'

export class DbFindSurveyByIdUseCase implements FindSurveyByIdUseCase {
  constructor(
    private readonly findSurveyByIdRepository: FindSurveyByIdRepository
  ) {}
  async findById(id: string): Promise<SurveyModel> {
    await this.findSurveyByIdRepository.findById(id)

    return {
      answers: [],
      createdAt: new Date(),
      id: '',
      question: '',
    }
  }
}
