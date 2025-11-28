import React from 'react'
import { render, screen } from '@testing-library/react'
import PreLoader from '../../Common/PreLoader'

describe('PreLoader Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<PreLoader />)
    expect(container).toBeInTheDocument()
  })

  it('should render a fixed loading spinner', () => {
    const { container } = render(<PreLoader />)
    const outerDiv = container.querySelector('div')
    expect(outerDiv).toHaveClass('fixed')
  })

  it('should render spinner with correct classes', () => {
    const { container } = render(<PreLoader />)
    const spinner = container.querySelector('div > div > div')
    expect(spinner).toHaveClass('animate-spin')
    expect(spinner).toHaveClass('rounded-full')
    expect(spinner).toHaveClass('border-4')
  })

  it('should cover full screen', () => {
    const { container } = render(<PreLoader />)
    const outerDiv = container.firstChild as HTMLElement
    expect(outerDiv).toHaveClass('h-screen')
    expect(outerDiv).toHaveClass('w-screen')
  })

  it('should be centered', () => {
    const { container } = render(<PreLoader />)
    const outerDiv = container.firstChild as HTMLElement
    expect(outerDiv).toHaveClass('flex')
    expect(outerDiv).toHaveClass('items-center')
    expect(outerDiv).toHaveClass('justify-center')
  })

  it('should match snapshot', () => {
    const { container } = render(<PreLoader />)
    expect(container).toMatchSnapshot()
  })
})
