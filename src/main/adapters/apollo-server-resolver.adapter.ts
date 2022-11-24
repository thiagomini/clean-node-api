import { Controller } from '@/presentation/protocols'

export const adaptResolver = async <TInput = Record<string, unknown>>(
  controller: Controller,
  input: TInput
): Promise<unknown> => {
  const response = await controller.handle(input)
  return response.body
}
