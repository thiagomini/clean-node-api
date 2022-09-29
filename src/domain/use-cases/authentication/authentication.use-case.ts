import { Optional } from '@/utils'
import { AuthenticationInput } from './authentication.input'

export interface Authentication {
  /**
   * Authenticates a user and returns a valid token with the user id as payload.
   */
  authenticate(
    authenticationInput: AuthenticationInput
  ): Promise<Optional<string>>
}
