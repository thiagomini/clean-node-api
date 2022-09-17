export function pick<T, K extends keyof T>(
  object: T,
  ...keys: K[]
): Pick<T, K> {
  const finalObject: Record<string, unknown> = {}

  for (const key of keys) {
    finalObject[key as string] = object[key]
  }

  return finalObject as Pick<T, K>
}

export function firstMissingAttributeOf<T>(
  object: T,
  requiredAttributes: string[]
): string | undefined {
  return requiredAttributes.find(
    (requiredAttribute) => object[requiredAttribute as keyof T] === undefined
  )
}
