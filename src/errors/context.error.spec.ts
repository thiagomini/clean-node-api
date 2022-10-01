import { ContextError } from './context.error'

describe('ContextError', () => {
  it('should expose an inner cause', () => {
    class SomeError extends Error {}

    const contextError = new ContextError({
      cause: new SomeError(),
      message: 'Error',
    })

    expect(contextError.cause).toBeInstanceOf(SomeError)
  })

  it('should expose an error message', () => {
    const contextError = new ContextError({
      message: 'some error message',
    })

    expect(contextError.message).toBe('some error message')
  })

  it('should expose a given context', () => {
    const contextError = new ContextError({
      context: {
        foo: 'bar',
      },
      message: 'Error',
    })

    expect(contextError.context).toEqual({
      foo: 'bar',
    })
  })

  it('should expose a given name', () => {
    const contextError = new ContextError({
      errorName: 'CustomError',
      message: 'Error',
    })

    expect(contextError.name).toBe('CustomError')
  })

  describe('toJSON()', () => {
    it('should return an object with error message', () => {
      const contextError = new ContextError({
        errorName: 'CustomError',
        message: 'Error',
      })

      expect(contextError.toJSON()).toEqual({
        error: contextError.message,
      })
    })
  })
})
