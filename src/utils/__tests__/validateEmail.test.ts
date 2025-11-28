import { validateEmail } from '../validateEmail'

describe('validateEmail', () => {
  it('should validate correct email addresses', () => {
    const validEmails = [
      'test@example.com',
      'user.name@example.com',
      'user+tag@example.co.uk',
      'test123@test.org',
    ]

    validEmails.forEach(email => {
      expect(validateEmail(email)).toBeTruthy()
    })
  })

  it('should reject invalid email addresses', () => {
    const invalidEmails = [
      'invalid',
      'test@',
      '@example.com',
      'test @example.com',
      'test@example',
      'test..email@example.com',
    ]

    invalidEmails.forEach(email => {
      expect(validateEmail(email)).toBeFalsy()
    })
  })

  it('should be case insensitive', () => {
    expect(validateEmail('TEST@EXAMPLE.COM')).toBeTruthy()
    expect(validateEmail('Test@Example.Com')).toBeTruthy()
  })

  it('should handle edge cases', () => {
    expect(validateEmail('')).toBeFalsy()
    expect(validateEmail(' ')).toBeFalsy()
  })
})
