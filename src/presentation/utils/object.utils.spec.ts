import { firstMissingAttributeOf, pick } from './object.utils'

describe('Object utils', () => {
  describe('pick', () => {
    it('should pick a single attribute', () => {
      const object = {
        key: 'value',
        key2: 'value2',
      }

      expect(pick(object, 'key')).toEqual({ key: 'value' })
    })

    it('should pick multiple attributes', () => {
      const object = {
        key: 'value',
        key2: 'value2',
      }

      expect(pick(object, 'key', 'key2')).toEqual(object)
    })
  })

  describe('firstMissingAttributeOf', () => {
    describe('when the object does not have one of the attributes', () => {
      it('should return the missing attribute', () => {
        const object = {
          name: 'any_name',
          email: 'any_mail@mail.com',
        }

        const requiredAttributes = ['name', 'email', 'password']

        expect(firstMissingAttributeOf(object, requiredAttributes)).toBe(
          'password'
        )
      })
    })

    describe('when the object has one of the required attributes set to undefined', () => {
      it('should return the missing attribute', () => {
        const object = {
          name: 'any_name',
          email: 'any_mail@mail.com',
          password: undefined,
        }

        const requiredAttributes = ['name', 'email', 'password']

        expect(firstMissingAttributeOf(object, requiredAttributes)).toBe(
          'password'
        )
      })
    })

    describe('when the object has all the required attributes', () => {
      it('should return the missing attribute', () => {
        const object = {
          name: 'any_name',
          email: 'any_mail@mail.com',
          password: 'any_password',
        }

        const requiredAttributes = ['name', 'email', 'password']

        expect(
          firstMissingAttributeOf(object, requiredAttributes)
        ).toBeUndefined()
      })
    })

    describe('when the object and required attributes are empty', () => {
      it('should return the missing attribute', () => {
        const object = {}

        const requiredAttributes: string[] = []

        expect(
          firstMissingAttributeOf(object, requiredAttributes)
        ).toBeUndefined()
      })
    })
  })
})
