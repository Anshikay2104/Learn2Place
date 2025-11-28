import { isInstitutionalEmail } from '../checkStudentInstitutionalEmail'

describe('isInstitutionalEmail', () => {
  it('should recognize valid institutional emails', () => {
    expect(isInstitutionalEmail('student@modyuniversity.ac.in')).toBe(true)
    expect(isInstitutionalEmail('STUDENT@MODYUNIVERSITY.AC.IN')).toBe(true)
    expect(isInstitutionalEmail('test123@modyuniversity.ac.in')).toBe(true)
  })

  it('should reject non-institutional emails', () => {
    expect(isInstitutionalEmail('student@gmail.com')).toBe(false)
    expect(isInstitutionalEmail('test@example.com')).toBe(false)
    expect(isInstitutionalEmail('user@yahoo.com')).toBe(false)
  })

  it('should be case insensitive', () => {
    expect(isInstitutionalEmail('Student@MODYUNIVERSITY.AC.IN')).toBe(true)
    expect(isInstitutionalEmail('STUDENT@modyuniversity.ac.in')).toBe(true)
  })

  it('should handle edge cases', () => {
    expect(isInstitutionalEmail('')).toBe(false)
    expect(isInstitutionalEmail('modyuniversity.ac.in')).toBe(false)
  })
})
