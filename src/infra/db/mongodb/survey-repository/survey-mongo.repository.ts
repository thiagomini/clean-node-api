import {
  AddSurveyRepository,
  LoadSurveySummaryByIdRepository,
} from '@/data/protocols/db/survey-repository'
import {
  AddSurveyInput,
  SurveyModel,
} from '@/data/use-cases/survey/add-survey/db-add-survey.use-case.protocols'
import {
  FindSurveyByIdRepository,
  Optional,
} from '@/data/use-cases/survey/find-survey/find-survey-by-id.protocols'
import { SurveySummaryModel } from '@/domain/models'
import { LoadSurveysUseCase } from '@/domain/use-cases/survey/list-surveys'
import { ObjectId } from 'mongodb'
import { getSurveysCollection, SurveysCollection } from '../helpers/collections'
import { isInvalidIdError } from '../helpers/error-helper'
import { addIdToDocument } from '../helpers/mongo-document-helper'
import { SurveyResultSchema } from '../schemas'

export type GroupedSurveyResults = Array<{
  _id: string
  numberOfAnswers: number
}>

export interface SurveysWithResultsCount {
  _id: ObjectId
  surveyId: ObjectId
  question: string
  answers: Array<{
    image?: string
    answer: string
    count: number
    percent: number
  }>
  createdAt: Date
  totalAnswers: number
  results: SurveyResultSchema[]
}

export class SurveyMongoRepository
  implements
    AddSurveyRepository,
    LoadSurveysUseCase,
    FindSurveyByIdRepository,
    LoadSurveySummaryByIdRepository
{
  async loadSummaryById(id: string): Promise<SurveySummaryModel> {
    const existingSurvey = await this.findById(id)

    if (!existingSurvey) {
      throw new Error(`Survey ${id} does not exist`)
    }

    const surveysWithResultCount = await this.getSuveyResultsCountAndPercentage(
      id
    )

    return {
      surveyId: surveysWithResultCount.surveyId.toString(),
      createdAt: surveysWithResultCount.createdAt,
      question: surveysWithResultCount.question,
      answers: surveysWithResultCount.answers,
    }
  }

  private async getSuveyResultsCountAndPercentage(
    surveyId: string
  ): Promise<SurveysWithResultsCount> {
    const surveyCollection = await this.getCollection()
    const surveyResultsGroupedBySurvey = (await surveyCollection
      .aggregate([
        {
          $match: {
            _id: new ObjectId(surveyId),
          },
        },
        {
          $lookup: {
            from: 'surveyresults',
            localField: '_id',
            foreignField: 'surveyId',
            as: 'results',
          },
        },
        {
          $addFields: {
            totalAnswers: {
              $size: '$results',
            },
          },
        },
        {
          $addFields: {
            answers: {
              $map: {
                input: '$answers',
                as: 'currentAnswer',
                in: {
                  $mergeObjects: [
                    '$$currentAnswer',
                    {
                      count: {
                        $size: {
                          $filter: {
                            input: '$results',
                            as: 'result',
                            cond: {
                              $eq: [
                                '$$result.answer',
                                '$$currentAnswer.answer',
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $addFields: {
            answers: {
              $map: {
                input: '$answers',
                as: 'currentAnswer',
                in: {
                  $mergeObjects: [
                    '$$currentAnswer',
                    {
                      percent: {
                        $cond: {
                          if: {
                            $eq: ['$totalAnswers', 0],
                          },
                          then: 0,
                          else: {
                            $multiply: [
                              100,
                              {
                                $divide: [
                                  '$$currentAnswer.count',
                                  '$totalAnswers',
                                ],
                              },
                            ],
                          },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $addFields: {
            surveyId: '$_id',
          },
        },
      ])
      .toArray()) as [SurveysWithResultsCount]

    return surveyResultsGroupedBySurvey[0]
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

  private async getCollection(): Promise<SurveysCollection> {
    return await getSurveysCollection()
  }
}
