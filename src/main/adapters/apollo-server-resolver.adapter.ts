import { Controller } from '@/presentation/protocols'

export const adaptResolver = async <TInput = Record<string, unknown>>(
  controller: Controller,
  input?: TInput,
  attributeToReturn?: string
): Promise<unknown> => {
  const response = await controller.handle(input)

  if (attributeToReturn) {
    return response?.body[attributeToReturn]
  }

  return response.body
}
