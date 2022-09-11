import { Optional } from './utility-types'

export function getFirstDefinedResponse<T extends (args: any) => unknown > (array: any[], functionToApply: Function): Optional<ReturnType<T>> {
  for (const element of array) {
    const response = functionToApply(element)
    if (response !== undefined) {
      return response
    }
  }
}
