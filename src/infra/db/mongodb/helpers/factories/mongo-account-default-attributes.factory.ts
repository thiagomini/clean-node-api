import { Role } from '@/auth'
import { ModelAttributes } from '@/domain/models'
import { AccountSchema } from '../../schemas'
import { SchemaDefaultAttributesFactory } from './interfaces'

export class MongoAccountDefaultAttributesFactory
  implements SchemaDefaultAttributesFactory<AccountSchema>
{
  defaultAttributes(): ModelAttributes<AccountSchema> {
    return {
      name: 'valid_name',
      email: 'valid_email',
      accessToken: 'valid_access_token',
      password: 'hashed_password',
      role: Role.User,
    }
  }
}
