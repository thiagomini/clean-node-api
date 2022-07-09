export function pick<T extends Record<string, unknown>, K extends keyof T> (object: T, ...keys: K[]): Pick<T, K> {
  const finalObject: Record<string, unknown> = {}

  for (const key of keys) {
    finalObject[key as string] = object[key]
  }

  return finalObject as Pick<T, K>
}
