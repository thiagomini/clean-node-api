import { Optional } from './utility-types'
import { getFirstDefinedResponse } from './array-utils'

describe('array utils', () => {
  describe('getFirstDefinedResponse', () => {
    it('should return the first defined response from applying a function to an array of elements', () => {
      // Arrange
      const returnsIfIsNumber = (element: unknown): Optional<number> => {
        if (Number.isInteger(element)) {
          return element as number
        }
      }

      const testArray = [true, {}, [], 'string', 42]

      // Act
      const response = getFirstDefinedResponse(testArray, returnsIfIsNumber)

      // Assert
      expect(response).toBe(42)
    })
  })
})
