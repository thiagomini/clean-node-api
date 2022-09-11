import { Optional } from './utility-types'

export function getFirstDefinedResponse<T extends (args: any) => unknown > (array: any[], functionToApply: Function): Optional<ReturnType<T>> {
  const maybeUndefined = array.reduce((_, inputToValidate) => {
    const response = functionToApply(inputToValidate)
    return response
  }, undefined)

  return maybeUndefined
}
