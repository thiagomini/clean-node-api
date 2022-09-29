import { Optional } from '@/utils'

export interface Validation {
  validate(input: unknown): Optional<Error>
}
