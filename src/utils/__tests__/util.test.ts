import { getImagePrefix } from '../util'

describe('getImagePrefix', () => {
  const originalEnv = process.env.NODE_ENV

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  it('should return /E-learning/ in production', () => {
    process.env.NODE_ENV = 'production'
    expect(getImagePrefix()).toBe('/E-learning/')
  })

  it('should return empty string in development', () => {
    process.env.NODE_ENV = 'development'
    expect(getImagePrefix()).toBe('')
  })

  it('should return empty string in test', () => {
    process.env.NODE_ENV = 'test'
    expect(getImagePrefix()).toBe('')
  })
})
