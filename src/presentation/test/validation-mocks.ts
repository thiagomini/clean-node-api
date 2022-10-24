import { Validation } from '@/presentation/protocols'
import { Optional } from '@/utils'

export const createValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate(): Optional<Error> {
      return undefined
    }
  }

  return new ValidationStub()
}
