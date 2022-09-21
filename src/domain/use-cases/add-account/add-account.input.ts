import { Role } from '../../../auth'

export interface AddAccountInput {
  name: string
  email: string
  password: string
  role?: Role
}
