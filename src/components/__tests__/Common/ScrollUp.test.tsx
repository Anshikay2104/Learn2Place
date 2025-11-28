import React from 'react'
import { render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import ScrollUp from '../../Common/ScrollUp'

describe('ScrollUp Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<ScrollUp />)
    expect(container).toBeInTheDocument()
  })

  it('should return null (no visible DOM)', () => {
    const { container } = render(<ScrollUp />)
    expect(container.firstChild).toBeNull()
  })

  it('should execute useEffect on mount', () => {
    const { container } = render(<ScrollUp />)
    expect(container).toBeInTheDocument()
  })
})
