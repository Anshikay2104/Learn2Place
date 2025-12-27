import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AskQuestionForm from '../../../app/(site)/forum/AskQuestionForm'

// Provide shared mock functions for useRouter so tests can assert on them
const mockRefresh = jest.fn()
const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh,
    push: mockPush,
  }),
}))

// Mock the Supabase client
jest.mock('@/utils/supabase/client', () => ({
  createSupabaseBrowserClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    },
    from: jest.fn(() => ({
      insert: jest.fn(),
    })),
  })),
}))

describe('AskQuestionForm Component', () => {
  let mockSupabase: any

  beforeEach(() => {
    jest.clearAllMocks()
    mockSupabase = require('@/utils/supabase/client').createSupabaseBrowserClient()
  })

  it('should render without crashing', () => {
    render(<AskQuestionForm />)
    const { container } = render(<AskQuestionForm />)
    expect(container).toBeInTheDocument()
  })

  it('should render the form even while auth status is pending', () => {
    mockSupabase.auth.getUser.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )
    render(<AskQuestionForm />)
    // The form fields should still be present
    expect(screen.getByPlaceholderText('Question title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Describe your question...')).toBeInTheDocument()
  })

  it('should render form wrapper', () => {
    const { container } = render(<AskQuestionForm />)
    const wrapper = container.querySelector('div.bg-white')
    expect(wrapper).toBeInTheDocument()
  })

  it('should have rounded styling class', () => {
    const { container } = render(<AskQuestionForm />)
    const wrapper = container.querySelector('div.rounded-xl')
    expect(wrapper).toBeInTheDocument()
  })

  it('submits the form and navigates to the created thread', async () => {
    const onClose = jest.fn()

    // Mock successful POST response from the API
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'q-123' }),
    } as any)

    render(<AskQuestionForm onClose={onClose} />)

    await userEvent.type(screen.getByPlaceholderText('Question title'), 'How to test?')
    await userEvent.type(screen.getByPlaceholderText('Describe your question...'), 'Please advise')

    await userEvent.click(screen.getByRole('button', { name: /Post Question/i }))

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())

    // Verify the fetch call payload
    const fetchMock = global.fetch as jest.Mock
    const [calledUrl, calledOptions] = fetchMock.mock.calls[0]
    expect(calledUrl).toBe(new URL('/api/questions', window.location.href).toString())
    expect(calledOptions.method).toBe('POST')
    expect(calledOptions.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(calledOptions.body)).toEqual({ title: 'How to test?', description: 'Please advise' })

    // Should navigate to the newly created question thread
    expect(mockPush).toHaveBeenCalledWith('/forum/q-123')

    // Should close the modal/form when onClose provided
    expect(onClose).toHaveBeenCalled()

    // cleanup fetch mock
    ;(global.fetch as jest.Mock).mockClear()
  })
})
