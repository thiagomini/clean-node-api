import { DbAuthenticationUseCase } from '../../../../data/use-cases/authentication/db-authentication.use-case'
import { Authentication } from '../../../../domain/use-cases/authentication'
import { BCryptHasherAdapter, JwtEcnrypterAdapter } from '../../../../infra/cryptography'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/account-mongo.repository'
import env from '../../../config/env'

export const createDbAuthentication = (): Authentication => {
  const accountMongoRepository = new AccountMongoRepository()
  const hashComparer = new BCryptHasherAdapter()
  const encrypter = new JwtEcnrypterAdapter(env.jwtSecret)

  const dbAuthentication = new DbAuthenticationUseCase(
    accountMongoRepository,
    hashComparer,
    encrypter,
    accountMongoRepository
  )

  return dbAuthentication
}
