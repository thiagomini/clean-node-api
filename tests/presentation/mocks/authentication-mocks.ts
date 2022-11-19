import { Authentication } from '@/domain/use-cases/authentication'

export const createAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async authenticate(): Promise<string> {
      return 'valid_token'
    }
  }

  return new AuthenticationStub()
}
