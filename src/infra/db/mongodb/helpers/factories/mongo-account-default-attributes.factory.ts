import { AccountModel, ModelAttributes } from '@/domain/models'
import { Role } from '@/auth'
import { ModelDefaultAttributesFactory } from './interfaces'

export class MongoAccountDefaultAttributesFactory
  implements ModelDefaultAttributesFactory<AccountModel>
{
  defaultAttributes(): ModelAttributes<AccountModel> {
    return {
      name: 'valid_name',
      email: 'valid_email',
      accessToken: 'valid_access_token',
      password: 'hashed_password',
      role: Role.User,
    }
  }
}
