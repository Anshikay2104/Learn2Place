import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ForumClient from '../../../app/(site)/forum/ForumClient'

// Mock useRouter used by AskQuestionForm nested inside the modal
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: jest.fn(),
  }),
}))

describe('ForumClient', () => {
  it('shows modal with AskQuestionForm when Post Question is clicked and closes it', async () => {
    render(<ForumClient />)

    // The button should be visible
    const btn = screen.getByRole('button', { name: /Post Question/i })
    expect(btn).toBeInTheDocument()

    // Modal should not be present yet
    expect(screen.queryByRole('dialog')).toBeNull()

    // Click to open modal
    await userEvent.click(btn)

    // Modal and form should appear; check modal header specifically
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    // The modal header is an h3; target that specific heading level to avoid duplicates
    expect(within(dialog).getByRole('heading', { level: 3, name: /Ask a Question/i })).toBeInTheDocument()

    // Close the modal via the close button
    const close = screen.getByRole('button', { name: /close modal/i })
    await userEvent.click(close)
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
