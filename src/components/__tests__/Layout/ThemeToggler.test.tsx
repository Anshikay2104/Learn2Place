import React from 'react'
import { render } from '@testing-library/react'
import ThemeToggler from '../../Layout/Header/ThemeToggler'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({
    theme: 'light',
    setTheme: jest.fn(),
  })),
}))

describe('ThemeToggler Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<ThemeToggler />)
    expect(container).toBeInTheDocument()
  })

  it('should display theme toggle button', () => {
    const { container } = render(<ThemeToggler />)
    const button = container.querySelector('button')
    expect(button).toBeInTheDocument()
  })

  it('should have aria-label for accessibility', () => {
    const { container } = render(<ThemeToggler />)
    const button = container.querySelector('button')
    expect(button).toHaveAttribute('aria-label')
  })

  it('should render SVG icon', () => {
    const { container } = render(<ThemeToggler />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should match snapshot', () => {
    const { container } = render(<ThemeToggler />)
    expect(container).toMatchSnapshot()
  })
})
