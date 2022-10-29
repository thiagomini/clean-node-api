import { Collection, ObjectId } from 'mongodb'
import {
  AddSurveyRepository,
  LoadSurveySummaryById,
} from '@/data/protocols/db/survey-repository'
import {
  AddSurveyInput,
  SurveyModel,
} from '@/data/use-cases/survey/add-survey/db-add-survey.use-case.protocols'
import { ModelAttributes, SurveySummaryModel } from '@/domain/models'
import { LoadSurveysUseCase } from '@/domain/use-cases/survey/list-surveys'
import {
  getSurveyResultsCollection,
  getSurveysCollection,
} from '../helpers/collections'
import { addIdToDocument } from '../helpers/mongo-document-helper'
import {
  FindSurveyByIdRepository,
  Optional,
} from '@/data/use-cases/survey/find-survey/find-survey-by-id.protocols'
import { isInvalidIdError } from '../helpers/error-helper'

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysUseCase,
    FindSurveyByIdRepository,
    LoadSurveySummaryById
{
  async loadSummaryById(id: string): Promise<SurveySummaryModel> {
    const existingSurvey = await this.findById(id)

    if (!existingSurvey) {
      throw new Error(`Survey ${id} does not exist`)
    }

    const surveyAnswerToImageMap = new Map()

    existingSurvey.answers.forEach((answer) => {
      surveyAnswerToImageMap.set(answer.answer, answer.image)
    })

    const surveyResultsCollection = await getSurveyResultsCollection()
    const surveyResultsGroupedBySurvey = (await surveyResultsCollection
      .aggregate([
        {
          $group: {
            _id: '$answer',
            numberOfAnswers: {
              $count: {},
            },
          },
        },
      ])
      .toArray()) as Array<{
      _id: string
      numberOfAnswers: number
    }>

    const totalAnswers = surveyResultsGroupedBySurvey.reduce(
      (total, resultsByAnswer) => total + resultsByAnswer.numberOfAnswers,
      0
    )

    return {
      surveyId: existingSurvey.id,
      createdAt: existingSurvey.createdAt,
      question: existingSurvey.question,
      answers: surveyResultsGroupedBySurvey.map((resultsByAnswer) => ({
        answer: resultsByAnswer._id,
        count: resultsByAnswer.numberOfAnswers,
        percent: (resultsByAnswer.numberOfAnswers / totalAnswers) * 100,
        image: surveyAnswerToImageMap.get(resultsByAnswer._id),
      })),
    }
  }

  async findById(id: string): Promise<Optional<SurveyModel>> {
    try {
      return await this.findSurveyById(id)
    } catch (err) {
      if (isInvalidIdError(err as Error)) {
        return undefined
      }

      throw err
    }
  }

  private async findSurveyById(id: string): Promise<Optional<SurveyModel>> {
    const surveysCollection = await this.getCollection()

    const surveyInDb = await surveysCollection.findOne({
      _id: new ObjectId(id),
    })

    if (surveyInDb) {
      return addIdToDocument(surveyInDb) as SurveyModel
    }
  }

  async list(): Promise<SurveyModel[]> {
    const surveysCollection = await this.getCollection()
    const surveysInDb = await surveysCollection.find().toArray()
    return surveysInDb.map(addIdToDocument) as SurveyModel[]
  }

  async add(addSurveyInput: AddSurveyInput): Promise<SurveyModel> {
    const surveysCollection = await this.getCollection()
    const surveyInputWithDate = {
      ...addSurveyInput,
      createdAt: new Date(),
    }
    await surveysCollection.insertOne(surveyInputWithDate)

    return addIdToDocument(surveyInputWithDate) as SurveyModel
  }

  private async getCollection(): Promise<
    Collection<ModelAttributes<SurveyModel>>
  > {
    return await getSurveysCollection()
  }
}
