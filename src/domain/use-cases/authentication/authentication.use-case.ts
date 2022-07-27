import { Optional } from '../../../utils'

export interface Authentication {
  /**
    * Authenticates a user and returns a valid token with the user id as payload.
   */
  authenticate: (email: string, password: string) => Promise<Optional<string>>
}
