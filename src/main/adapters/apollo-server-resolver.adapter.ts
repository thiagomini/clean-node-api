import { Controller } from '@/presentation/protocols'

export interface AdaptResolverOptions<TInput = Record<string, unknown>> {
  controller: Controller
  input?: TInput
  attributeToReturn?: string
}

export const adaptResolver = async <TInput = Record<string, unknown>>({
  controller,
  attributeToReturn,
  input,
}: AdaptResolverOptions<TInput>): Promise<unknown> => {
  const response = await controller.handle(input)

  if (attributeToReturn) {
    return response?.body[attributeToReturn]
  }

  return response.body
}
