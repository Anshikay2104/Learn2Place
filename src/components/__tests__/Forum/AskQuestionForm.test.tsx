import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AskQuestionForm from '../../../app/(site)/forum/AskQuestionForm'

// Mock useRouter first
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
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

  it('should show checking login status initially', () => {
    mockSupabase.auth.getUser.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )
    render(<AskQuestionForm />)
    expect(screen.getByText('Checking login status...')).toBeInTheDocument()
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
})
