import { MissingParamException } from '@/presentation/errors'
import { RequiredFieldValidation } from './required-field.validation'

describe('RequiredFieldValidation', () => {
  describe('validate', () => {
    it('should return InvalidParamException if required field is not set', () => {
      const input = {
        key: 'value',
      }
      const sut = new RequiredFieldValidation(['requiredFieldName'])

      expect(sut.validate(input)).toEqual(
        new MissingParamException('requiredFieldName')
      )
    })

    it('should return undefined if required field is set', () => {
      const input = {
        requiredFieldName: 'value',
      }
      const sut = new RequiredFieldValidation(['requiredFieldName'])

      expect(sut.validate(input)).toBeUndefined()
    })
  })
})
