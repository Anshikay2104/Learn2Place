import React from 'react'
import { render, screen } from '@testing-library/react'
import Loader from '@/components/Common/Loader'

describe('Loader Component', () => {
  it('renders without crashing', () => {
    render(<Loader />)
    // Add assertions based on your component
  })
})