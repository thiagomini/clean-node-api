export interface LogSchema {
  name: string
  stack: string
  context: Record<string, any>
  cause: string
  createdAt: Date
}
