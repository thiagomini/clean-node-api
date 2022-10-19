import {
  Decrypter,
  Encrypter,
  HashComparer,
  Hasher,
} from '@/data/protocols/cryptography'

export const createHasherStub = (): Hasher => {
  class EncrypterStub implements Hasher {
    async hash(): Promise<string> {
      return 'hashed_password'
    }
  }
  return new EncrypterStub()
}

export const createEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(): Promise<string> {
      return 'token'
    }
  }

  return new EncrypterStub()
}

export const createDecrypterStub = (returnedValue: string): Decrypter => {
  class DecrypterStub implements Decrypter {
    public async decrypt(): Promise<string> {
      return returnedValue
    }
  }
  const decrypterStub = new DecrypterStub()
  return decrypterStub
}

export const createHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(): Promise<boolean> {
      return true
    }
  }

  return new HashComparerStub()
}
