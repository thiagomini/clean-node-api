import { Role } from '../../auth'

export interface AccountModel {
  id: string
  name: string
  email: string
  password: string
  accessToken?: string
  role: Role
}
