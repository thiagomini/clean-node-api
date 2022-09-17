import { DbAddAccountUseCase } from '../../../../data/use-cases/add-account/db-add-account.use-case'
import { BCryptHasherAdapter } from '../../../../infra/cryptography'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/account-mongo.repository'

export const createDbAddAccount = (): DbAddAccountUseCase => {
  const encrypter = new BCryptHasherAdapter()
  const mongoAccountRepository = new AccountMongoRepository()

  return new DbAddAccountUseCase(
    encrypter,
    mongoAccountRepository,
    mongoAccountRepository
  )
}
