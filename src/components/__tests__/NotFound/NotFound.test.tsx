import React from 'react'
import { render } from '@testing-library/react'
import NotFound from '../../NotFound/index'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

jest.mock('@/utils/util', () => ({
  getImagePrefix: () => '',
}))

describe('NotFound Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<NotFound />)
    expect(container).toBeInTheDocument()
  })

  it('should display 404 message', () => {
    const { getByText } = render(<NotFound />)
    expect(
      getByText(/we can't seem to find the page/i)
    ).toBeInTheDocument()
  })

  it('should display helpful description', () => {
    const { getByText } = render(<NotFound />)
    expect(getByText(/oops!/i)).toBeInTheDocument()
  })

  it('should render Home link', () => {
    const { getByText } = render(<NotFound />)
    const homeLink = getByText('Go To Home')
    expect(homeLink).toBeInTheDocument()
    expect(homeLink.closest('a')).toHaveAttribute('href', '/')
  })

  it('should render 404 image', () => {
    const { container } = render(<NotFound />)
    const img = container.querySelector('img')
    expect(img).toBeInTheDocument()
  })

  it('should match snapshot', () => {
    const { container } = render(<NotFound />)
    expect(container).toMatchSnapshot()
  })
})
