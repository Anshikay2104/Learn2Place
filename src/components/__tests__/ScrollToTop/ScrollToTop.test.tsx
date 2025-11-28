import React from 'react'
import { render, screen } from '@testing-library/react'
import ScrollToTop from '../../ScrollToTop/index'

describe('ScrollToTop Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset scroll position
    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true,
    })
  })

  it('should render without crashing', () => {
    const { container } = render(<ScrollToTop />)
    expect(container).toBeInTheDocument()
  })

  it('should not show button initially', () => {
    render(<ScrollToTop />)
    const button = screen.queryByLabelText('scroll to top')
    expect(button).not.toBeInTheDocument()
  })

  it('should render component correctly', () => {
    const { container } = render(<ScrollToTop />)
    const wrapper = container.querySelector('div.fixed')
    expect(wrapper).toBeInTheDocument()
  })

  it('should have correct wrapper classes', () => {
    const { container } = render(<ScrollToTop />)
    const wrapper = container.querySelector('div')
    expect(wrapper).toHaveClass('fixed')
    expect(wrapper).toHaveClass('bottom-8')
    expect(wrapper).toHaveClass('right-8')
  })

  it('should cleanup event listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
    const { unmount } = render(<ScrollToTop />)

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })

  it('should add scroll event listener on mount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    render(<ScrollToTop />)

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
    addEventListenerSpy.mockRestore()
  })

  it('should match snapshot', () => {
    const { container } = render(<ScrollToTop />)
    expect(container).toMatchSnapshot()
  })
})
