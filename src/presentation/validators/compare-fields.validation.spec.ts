import { CompareFieldsValidation } from './compare-fields.validation'

describe('CompareFieldsValidation', () => {
  const compareFieldsValidation = new CompareFieldsValidation('field1', 'field2')
  describe('compare', () => {
    describe('when both fields exist', () => {
      it.each([
        'string',
        1,
        true
      ])('it should return undefined when both are equal primitives', (value) => {
        const input = {
          field1: value,
          field2: value
        }
        expect(compareFieldsValidation.validate(input)).toBeUndefined()
      })
    })
  })
})
