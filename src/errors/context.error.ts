export type ErrorCause = Error | ContextError

export interface ContextErrorInput {
  message: string
  context?: unknown
  cause?: ErrorCause
  errorName?: string
}

export class ContextError extends Error {
  public readonly cause?: ErrorCause
  public readonly context?: unknown

  constructor(errorInput: ContextErrorInput) {
    super(errorInput.message)
    this.cause = errorInput.cause
    this.context = errorInput.context
    this.name = errorInput.errorName ?? ContextError.name
  }

  public toJSON(): Record<string, string> {
    return {
      error: this.message,
    }
  }
}
