import { Optional } from './utility-types'

/**
 * Applies the given function to each element of the input array and returns the first non undefined value.
 * if the function returns undefined for all elements, then it returns undefined as well.
 */
export function getFirstDefinedResponse<T extends (args: any) => unknown > (array: any[], functionToApply: Function): Optional<ReturnType<T>> {
  for (const element of array) {
    const response = functionToApply(element)
    if (response !== undefined) {
      return response
    }
  }
}
