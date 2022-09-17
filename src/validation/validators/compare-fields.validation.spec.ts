import { InvalidParamException } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-fields.validation'

describe('CompareFieldsValidation', () => {
  const compareFieldsValidation = new CompareFieldsValidation(
    'field1',
    'field2'
  )
  describe('compare', () => {
    describe('when both fields exist', () => {
      it.each(['string', 1, true])(
        'it should return undefined when both are equal primitives',
        (value) => {
          const input = {
            field1: value,
            field2: value,
          }
          expect(compareFieldsValidation.validate(input)).toBeUndefined()
        }
      )

      it.each([
        ['string', 'otherString'],
        [1, 2],
        [true, false],
      ])(
        'it should return InvalidParamException when fields are different primitives',
        (value, otherValue) => {
          const input = {
            field1: value,
            field2: otherValue,
          }
          expect(compareFieldsValidation.validate(input)).toEqual(
            new InvalidParamException('field2')
          )
        }
      )
    })

    describe('when input is undefined', () => {
      it('should return undefined', () => {
        expect(
          compareFieldsValidation.validate(
            undefined as unknown as Record<string, any>
          )
        ).toBeUndefined()
      })
    })
  })
})
