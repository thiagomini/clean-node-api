import { buildSurveyInput } from '@/data/test-data-builders/survey'
import { AccountModel, ModelAttributes, SurveyModel } from '@/domain/models'
import {
  AddSurveyInput,
  AddSurveyUseCase,
} from '@/domain/use-cases/survey/add-survey'
import { Collection } from 'mongodb'
import { getSurveysCollection } from '../../../infra/db/mongodb/helpers/collections'
import { createDbAddSurveyUseCase } from '../../factories'

export interface SignupUserInput extends Partial<Omit<AccountModel, 'id'>> {}

export class SurveyDSL {
  constructor(
    private readonly addSurveyUseCase: AddSurveyUseCase,
    private readonly surveysCollection: Collection<ModelAttributes<SurveyModel>>
  ) {}

  async createSurvey(
    addSurveyInput?: Partial<AddSurveyInput>
  ): Promise<string> {
    const finalInput = buildSurveyInput(addSurveyInput)

    await this.addSurveyUseCase.add(finalInput)

    const surveyInDb = await this.surveysCollection.findOne({
      question: finalInput.question,
      answers: finalInput.answers,
    })

    return surveyInDb?._id.toString() as string
  }

  public static async create(): Promise<SurveyDSL> {
    return new SurveyDSL(
      createDbAddSurveyUseCase(),
      await getSurveysCollection()
    )
  }
}