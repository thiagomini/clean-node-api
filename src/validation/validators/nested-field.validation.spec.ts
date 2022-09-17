import { Validation } from '../../presentation/protocols'
import { Optional } from '../../utils'
import { NestedFieldValidation } from './nested-field.validation'
describe('NestedFieldValidation', () => {
  describe('validate', () => {
    it('should pass if passed validation succeeds', () => {
      const { sut } = createSut()

      expect(
        sut.validate({
          nestedObject: {},
        })
      ).toBeUndefined()
    })

    it('should return an error if passed validation fails', () => {
      const { sut, stubValidation } = createSut()
      jest.spyOn(stubValidation, 'validate').mockReturnValueOnce(new Error())

      expect(
        sut.validate({
          nestedObject: {},
        })
      ).toBeInstanceOf(Error)
    })

    it('should return an error if one of the validations fails', () => {
      // Arrange
      const stubValidation1 = createStubValidation()
      const stubValidation2 = createStubValidation()

      jest.spyOn(stubValidation2, 'validate').mockReturnValueOnce(new Error())

      const sut = new NestedFieldValidation('nestedObject', [
        stubValidation1,
        stubValidation2,
      ])

      // Act & Assert
      expect(sut.validate({ nestedObject: {} })).toBeInstanceOf(Error)
    })
  })
})

interface SutFactoryResponse {
  sut: NestedFieldValidation
  stubValidation: Validation
}

const createSut = (): SutFactoryResponse => {
  const stubValidation = createStubValidation()
  const sut = new NestedFieldValidation('nestedObject', [stubValidation])

  return {
    sut,
    stubValidation,
  }
}

const createStubValidation = (): Validation => {
  class StubValidation implements Validation {
    validate(): Optional<Error> {
      return undefined
    }
  }

  return new StubValidation()
}
