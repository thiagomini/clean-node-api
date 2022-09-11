import { Validation } from '../../presentation/protocols'
import { Optional } from '../../utils'
import { NestedFieldValidation } from './nested-field.validation'
describe('NestedFieldValidation', () => {
  describe('validate', () => {
    it('should pass if passed validation succeeds', () => {
      class StubValidation implements Validation {
        validate (): Optional<Error> {
          return undefined
        }
      }

      const sut = new NestedFieldValidation('nestedObject', [
        new StubValidation()
      ])

      expect(sut.validate({
        nestedObject: {}
      })).toBeUndefined()
    })
  })
})
