import { Validation } from '../../presentation/protocols'
import { Optional } from '../../utils'
import { EachValidation } from './each-validation'

describe('EachValidation', () => {
  describe('validate', () => {
    it('should return undefined if all validations pass for all objects', () => {
      const { sut } = createSut()

      expect(sut.validate([{}])).toBeUndefined()
    })
  })
})

interface SutFactoryResponse {
  sut: EachValidation
  stubValidation1: Validation
  stubValidation2: Validation
}

const createSut = (): SutFactoryResponse => {
  const stubValidation1 = createStubValidation()
  const stubValidation2 = createStubValidation()
  const sut = new EachValidation([
    stubValidation1,
    stubValidation2
  ])

  return {
    sut,
    stubValidation1,
    stubValidation2
  }
}

const createStubValidation = (): Validation => {
  class StubValidation implements Validation {
    validate (): Optional<Error> {
      return undefined
    }
  }

  return new StubValidation()
}
