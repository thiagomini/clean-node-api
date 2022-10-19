import { AccountModel } from '@/domain/models'
import { Optional } from '@/utils'
import {
  AddAccountRepository,
  LoadAccountByEmailRepository,
  LoadAccountByIdRepository,
  LoadAccountByTokenRepository,
  UpdateAccessTokenRepository,
} from '@/data/protocols/db/account-repository'
import { fakeAccount } from '@/domain/test'
import { createMock } from '@golevelup/ts-jest'

export const createLoadAccountByEmailRepositoryStub = (
  returnedValue?: AccountModel
): any => {
  class RepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail(): Promise<Optional<AccountModel>> {
      return returnedValue
    }
  }

  return new RepositoryStub()
}

export const createAddAccountRepositoryStub = (): any => {
  class RepositoryStub implements AddAccountRepository {
    public async add(): Promise<AccountModel> {
      return fakeAccount()
    }
  }

  return new RepositoryStub()
}

export const createLoadAccountByIdStub = () =>
  createMock<LoadAccountByIdRepository>({
    async loadById() {
      return fakeAccount()
    },
  })

export const createLoadAccountByTokenRepositoryStub =
  (): LoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
      implements LoadAccountByTokenRepository
    {
      public async loadByToken(): Promise<AccountModel> {
        return fakeAccount()
      }
    }
    const repositoryStub = new LoadAccountByTokenRepositoryStub()
    return repositoryStub
  }

export const createUpdateAccessTokenRepositoryStub =
  (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub
      implements UpdateAccessTokenRepository
    {
      async updateAccessToken(): Promise<void> {}
    }

    return new UpdateAccessTokenRepositoryStub()
  }
