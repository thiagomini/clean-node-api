import { adaptResolver } from '../../adapters/apollo-server-resolver.adapter'
import { createLoadSurveysController } from '../../factories/controllers/survey/load-surveys/load-surveys-controller.factory'

export default {
  Query: {
    surveys: async () =>
      await adaptResolver({
        controller: createLoadSurveysController(),
        attributeToReturn: 'surveys',
      }),
  },
}
