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

    it('should return the first undefined if passed function returns undefined for all elements', () => {
      // Arrange
      const returnsUndefined = (): undefined => undefined

      const testArray = [true, {}, [], 'string', 42]

      // Act
      const response = getFirstDefinedResponse(testArray, returnsUndefined)

      // Assert
      expect(response).toBeUndefined()
    })
  })
})
