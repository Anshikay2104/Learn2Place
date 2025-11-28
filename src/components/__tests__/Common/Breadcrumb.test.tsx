import React from 'react'
import { render } from '@testing-library/react'
import Breadcrumb from '../../Common/Breadcrumb'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe('Breadcrumb Component', () => {
  const defaultProps = {
    pageName: 'Test Page',
    pageDescription: 'This is a test page description',
  }

  it('should render without crashing', () => {
    const { container } = render(<Breadcrumb {...defaultProps} />)
    expect(container).toBeInTheDocument()
  })

  it('should display page name in heading', () => {
    const { container } = render(<Breadcrumb {...defaultProps} />)
    const heading = container.querySelector('h1')
    expect(heading).toHaveTextContent('Test Page')
  })

  it('should display page description', () => {
    const { getByText } = render(<Breadcrumb {...defaultProps} />)
    expect(getByText('This is a test page description')).toBeInTheDocument()
  })

  it('should render Home link', () => {
    const { getByText } = render(<Breadcrumb {...defaultProps} />)
    const homeLink = getByText('Home')
    expect(homeLink).toBeInTheDocument()
    expect(homeLink.closest('a')).toHaveAttribute('href', '/')
  })

  it('should display breadcrumb separator', () => {
    const { getByText } = render(<Breadcrumb {...defaultProps} />)
    expect(getByText('/')).toBeInTheDocument()
  })

  it('should match snapshot', () => {
    const { container } = render(<Breadcrumb {...defaultProps} />)
    expect(container).toMatchSnapshot()
  })
})
