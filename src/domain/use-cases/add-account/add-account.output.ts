import { AccountModel } from '../../models'
export interface AddAccountOutput extends AccountModel {
  /**
   * If true, indicates this account was just created. Otherwise, indicates that the account already existed
   * and was simply returned.
   */
  isNew: boolean
}
