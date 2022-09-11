import { Validation } from '../../presentation/protocols'
import { Optional } from '../../utils'
import { NestedFieldValidation } from './nested-field.validation'
describe('NestedFieldValidation', () => {
  describe('validate', () => {
    it('should pass if passed validation succeeds', () => {
      const { sut } = createSut()

      expect(sut.validate({
        nestedObject: {}
      })).toBeUndefined()
    })
  })
})

interface SutFactoryResponse {
  sut: NestedFieldValidation
  stubValidation: Validation
}

const createSut = (): SutFactoryResponse => {
  const stubValidation = createStubValidation()
  const sut = new NestedFieldValidation('nestedObject', [
    stubValidation
  ])

  return {
    sut,
    stubValidation
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
