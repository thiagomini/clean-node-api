export interface GqlHttpRequest<TVariables = Record<string, unknown>> {
  query: string
  variables?: TVariables
}
