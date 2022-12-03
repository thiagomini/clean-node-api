import { adaptResolver } from '@/main/adapters/apollo-server-resolver.adapter'
import { createLoadSurveySummaryController } from '@/main/factories/controllers/survey/load-survey-summary/load-survey-summary-controller.factory'

export default {
  Query: {
    surveySummary: async (_parent: never, args: any) =>
      await adaptResolver({
        controller: createLoadSurveySummaryController(),
        input: args,
      }),
  },
}
