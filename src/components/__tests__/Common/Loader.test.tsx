import React from 'react'
import { render, screen } from '@testing-library/react'
import Loader from '../../Common/Loader'

describe('Loader Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<Loader />)
    expect(container).toBeInTheDocument()
  })

  it('should render a span element', () => {
    const { container } = render(<Loader />)
    const span = container.querySelector('span')
    expect(span).toBeInTheDocument()
  })

  it('should have animate-spin class', () => {
    const { container } = render(<Loader />)
    const span = container.querySelector('span')
    expect(span).toHaveClass('animate-spin')
  })

  it('should have correct styling classes', () => {
    const { container } = render(<Loader />)
    const span = container.querySelector('span')
    expect(span).toHaveClass('rounded-full')
    expect(span).toHaveClass('border-2')
    expect(span).toHaveClass('border-solid')
    expect(span).toHaveClass('border-white')
  })

  it('should match snapshot', () => {
    const { container } = render(<Loader />)
    expect(container).toMatchSnapshot()
  })
})
