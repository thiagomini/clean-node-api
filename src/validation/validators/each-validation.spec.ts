import { Validation } from '../../presentation/protocols'
import { Optional } from '../../utils'
import { EachValidation } from './each-validation'
import { when } from 'jest-when'

describe('EachValidation', () => {
  describe('validate', () => {
    describe('when all validations pass', () => {
      it('should return undefined', () => {
        const { sut } = createSut()

        expect(sut.validate([{}])).toBeUndefined()
      })
    })

    describe('when all validations fails', () => {
      it('should return the first error returned from the validators', () => {
        // Arrange
        const { sut, stubValidation1, stubValidation2 } = createSut()

        const errorThrownByFirstValidator = new Error('Error 1')
        const errorThrownBySecondValidator = new Error('Error 2')
        jest.spyOn(stubValidation1, 'validate').mockReturnValueOnce(errorThrownByFirstValidator)
        jest.spyOn(stubValidation2, 'validate').mockReturnValueOnce(errorThrownBySecondValidator)

        // Act & Assert
        expect(sut.validate([{}])).toBe(errorThrownByFirstValidator)
      })
    })

    describe('when a validation fails for one object', () => {
      it('should return an error', () => {
        // Arrange
        const { sut, stubValidation2 } = createSut()

        const errorThrownBySecondValidator = new Error('Error 2')
        const validateSpy = jest.spyOn(stubValidation2, 'validate')
        when(validateSpy).calledWith({ key: 'shouldFail' }).mockReturnValueOnce(errorThrownBySecondValidator)

        // Act & Assert
        expect(sut.validate([{ }, { key: 'shouldFail' }])).toBe(errorThrownBySecondValidator)
      })
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
