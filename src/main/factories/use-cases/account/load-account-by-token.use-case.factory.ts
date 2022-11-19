import { DbLoadAccountByTokenUseCase } from '@/data/use-cases/account/load-account-by-token'
import { JwtEcnrypterAdapter } from '@/infra/cryptography'
import { AccountMongoRepository } from '@/infra/db/mongodb/repositories'
import env from '@/main/config/env'

export const createDbLoadAccountByToken = (): DbLoadAccountByTokenUseCase => {
  const encrypter = new JwtEcnrypterAdapter(env.jwtSecret)
  const mongoAccountRepository = new AccountMongoRepository()

  return new DbLoadAccountByTokenUseCase(encrypter, mongoAccountRepository)
}
