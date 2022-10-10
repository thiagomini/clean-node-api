import { CreateOrUpdateSurveyResultRepository } from '@/data/protocols/db/survey-result-repository'
import { SaveSurveyResultInput } from '../../../../domain/use-cases/save-survey-result'
import { NonexistentAccountError } from '../../../../domain/use-cases/save-survey-result/errors'

export class SurveyResultMongoRepository
  implements CreateOrUpdateSurveyResultRepository
{
  async createOrUpdate(
    saveSurveyResultInput: SaveSurveyResultInput
  ): Promise<void> {
    throw new NonexistentAccountError({
      accountId: saveSurveyResultInput.accountId,
    })
  }
}
