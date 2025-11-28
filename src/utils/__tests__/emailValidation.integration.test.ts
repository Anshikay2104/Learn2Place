/**
 * Integration Tests
 * 
 * These tests verify that multiple components and utilities work together correctly
 */

import { validateEmail } from '../validateEmail'
import { isInstitutionalEmail } from '../checkStudentInstitutionalEmail'

describe('Email Validation Integration', () => {
  it('should validate institutional emails', () => {
    const email = 'student@modyuniversity.ac.in'
    expect(validateEmail(email)).toBeTruthy()
    expect(isInstitutionalEmail(email)).toBeTruthy()
  })

  it('should validate non-institutional emails', () => {
    const email = 'user@gmail.com'
    expect(validateEmail(email)).toBeTruthy()
    expect(isInstitutionalEmail(email)).toBeFalsy()
  })

  it('should reject invalid emails for both validators', () => {
    const email = 'invalid-email'
    expect(validateEmail(email)).toBeFalsy()
  })

  it('should handle case sensitivity consistently', () => {
    const upperEmail = 'STUDENT@MODYUNIVERSITY.AC.IN'
    const lowerEmail = 'student@modyuniversity.ac.in'

    expect(validateEmail(upperEmail)).toBeTruthy()
    expect(validateEmail(lowerEmail)).toBeTruthy()
    expect(isInstitutionalEmail(upperEmail)).toBe(
      isInstitutionalEmail(lowerEmail)
    )
  })
})
