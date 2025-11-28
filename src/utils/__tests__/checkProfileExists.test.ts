import { checkProfileExists } from '../checkProfileExists'
import { SupabaseClient } from '@supabase/supabase-js'

describe('checkProfileExists', () => {
  let mockSupabase: Partial<SupabaseClient>

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn(),
    } as Partial<SupabaseClient>
  })

  it('should return false and null profile for empty email', async () => {
    const result = await checkProfileExists(
      mockSupabase as SupabaseClient,
      ''
    )

    expect(result).toEqual({ exists: false, profile: null })
  })

  it('should return profile when it exists', async () => {
    const mockProfile = { id: '1', email: 'test@example.com', name: 'Test User' }

    ;(mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          maybeSingle: jest.fn().mockResolvedValue({ data: mockProfile }),
        }),
      }),
    })

    const result = await checkProfileExists(
      mockSupabase as SupabaseClient,
      'test@example.com'
    )

    expect(result).toEqual({ exists: true, profile: mockProfile })
  })

  it('should return false when profile does not exist', async () => {
    ;(mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          maybeSingle: jest.fn().mockResolvedValue({ data: null }),
        }),
      }),
    })

    const result = await checkProfileExists(
      mockSupabase as SupabaseClient,
      'nonexistent@example.com'
    )

    expect(result).toEqual({ exists: false, profile: null })
  })

  it('should convert email to lowercase', async () => {
    const mockEq = jest.fn().mockReturnValue({
      maybeSingle: jest.fn().mockResolvedValue({ data: null }),
    })

    ;(mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({ eq: mockEq }),
    })

    await checkProfileExists(
      mockSupabase as SupabaseClient,
      'TEST@EXAMPLE.COM'
    )

    expect(mockEq).toHaveBeenCalledWith('email', 'test@example.com')
  })

  it('should query profiles table', async () => {
    const mockSelect = jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        maybeSingle: jest.fn().mockResolvedValue({ data: null }),
      }),
    })

    ;(mockSupabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
    })

    await checkProfileExists(
      mockSupabase as SupabaseClient,
      'test@example.com'
    )

    expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
    expect(mockSelect).toHaveBeenCalledWith('*')
  })

  it('should handle database errors gracefully', async () => {
    const mockError = new Error('Database connection failed')

    ;(mockSupabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          maybeSingle: jest.fn().mockRejectedValue(mockError),
        }),
      }),
    })

    await expect(
      checkProfileExists(mockSupabase as SupabaseClient, 'test@example.com')
    ).rejects.toThrow('Database connection failed')
  })
})
