export const isInvalidIdError = (err: Error): boolean => {
  return err?.name === 'BSONTypeError'
}
