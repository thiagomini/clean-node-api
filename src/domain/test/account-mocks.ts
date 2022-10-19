import { Role } from '@/auth'
import { AccountModel } from '@/domain/models'
import { AddAccountInput } from '@/domain/use-cases/account/add-account'

export const fakeAccount = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid_email@mail.com',
  name: 'valid_name',
  password: 'hashed_password',
  role: Role.User,
})

export const fakeAccountInput = (): AddAccountInput => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
})
