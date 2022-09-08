import { Collection } from 'mongodb'
import { AddSurveyRepository } from '../../../../data/protocols/db/survey-repository'
import { AddSurveyInput, SurveyModel } from '../../../../data/use-cases/add-survey/db-add-survey.use-case.protocols'

export class SurveyMongoRepository implements AddSurveyRepository {
  constructor (private readonly accountCollection: Collection) {}
  async add (addSurveyInput: AddSurveyInput): Promise<SurveyModel> {
    return {
      id: 'any_id',
      ...addSurveyInput
    }
  }
}
