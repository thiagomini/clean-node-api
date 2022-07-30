import { Optional } from '../../utils'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

describe('ValidationComposite', () => {
  describe('validate', () => {
    it('should return an error if one validation fails', () => {
      const { sut, validations } = createSut()

      jest.spyOn(validations[1], 'validate').mockReturnValueOnce(new Error('some error'))

      const response = sut.validate({})

      expect(response).toEqual(new Error('some error'))
    })

    it('should call all validations with the same input', () => {
      // Arrange
      const { sut, validations } = createSut()
      const spyValidation1 = jest.spyOn(validations[0], 'validate')
      const spyValidation2 = jest.spyOn(validations[1], 'validate')
      const input = {}

      // Act
      sut.validate(input)

      // Assert
      expect(spyValidation1).toHaveBeenCalledWith(input)
      expect(spyValidation2).toHaveBeenCalledWith(input)
    })
  })
})

interface SutFactoryResponse {
  sut: ValidationComposite
  validations: [Validation, Validation]
}

const createSut = (): SutFactoryResponse => {
  const validations = createValidationStubs()
  const sut = new ValidationComposite(validations)

  return {
    sut,
    validations
  }
}

const createValidationStubs = (): [Validation, Validation] => {
  class ValidationStub implements Validation {
    validate (input: unknown): Optional<Error> {
      return undefined
    }
  }

  return [
    new ValidationStub(),
    new ValidationStub()
  ]
}
