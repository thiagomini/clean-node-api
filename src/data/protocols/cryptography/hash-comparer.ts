export interface HashComparer {
  compare(value: string, hash: string): boolean
}
