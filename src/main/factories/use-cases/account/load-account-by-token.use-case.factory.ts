import { DbLoadAccountByTokenUseCase } from '../../../../data/use-cases/load-account-by-token/db-load-account-by-token.use-case'
import { JwtEcnrypterAdapter } from '../../../../infra/cryptography'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/account-mongo.repository'
import env from '../../../config/env'

export const createDbLoadAccountByToken = (): DbLoadAccountByTokenUseCase => {
  const encrypter = new JwtEcnrypterAdapter(env.jwtSecret)
  const mongoAccountRepository = new AccountMongoRepository()

  return new DbLoadAccountByTokenUseCase(encrypter, mongoAccountRepository)
}
