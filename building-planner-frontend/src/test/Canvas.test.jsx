import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Canvas from '../components/Canvas'

describe('Canvas', () => {
  const defaultProps = {
    activeTool: 'select',
    shapes: [],
    setShapes: vi.fn(),
    showAnnotations: true,
    selectedShape: null,
    setSelectedShape: vi.fn(),
  }

  it('renders canvas element', () => {
    render(<Canvas {...defaultProps} />)

    expect(screen.getByText('Drawing Canvas')).toBeInTheDocument()
    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('shows correct instructions for select tool', () => {
    render(<Canvas {...defaultProps} />)
    
    expect(screen.getByText(/Click shapes to select, drag to move, press Delete to remove/)).toBeInTheDocument()
  })

  it('shows correct instructions for drawing tools', () => {
    render(<Canvas {...defaultProps} activeTool="line" />)
    
    expect(screen.getByText(/Click and drag to draw line/)).toBeInTheDocument()
  })

  it('shows polygon-specific instructions', () => {
    render(<Canvas {...defaultProps} activeTool="polygon" />)
    
    expect(screen.getByText(/Click to add points, click near first point or press Enter to complete/)).toBeInTheDocument()
  })

  it('shows selected shape info when shape is selected', () => {
    const selectedShape = {
      id: 1,
      type: 'rectangle',
      coordinates: { startX: 10, startY: 10, endX: 50, endY: 50 }
    }
    
    render(<Canvas {...defaultProps} selectedShape={selectedShape} />)
    
    expect(screen.getByText('Selected: rectangle')).toBeInTheDocument()
    expect(screen.getByText('Deselect')).toBeInTheDocument()
  })

  it('calls setSelectedShape when deselect button is clicked', () => {
    const setSelectedShape = vi.fn()
    const selectedShape = {
      id: 1,
      type: 'rectangle',
      coordinates: { startX: 10, startY: 10, endX: 50, endY: 50 }
    }
    
    render(<Canvas {...defaultProps} selectedShape={selectedShape} setSelectedShape={setSelectedShape} />)
    
    const deselectButton = screen.getByText('Deselect')
    fireEvent.click(deselectButton)
    
    expect(setSelectedShape).toHaveBeenCalledWith(null)
  })

  it('handles mouse events on canvas', () => {
    const setShapes = vi.fn()

    render(<Canvas {...defaultProps} activeTool="line" setShapes={setShapes} />)

    const canvas = document.querySelector('canvas')

    // Simulate drawing a line
    fireEvent.mouseDown(canvas, { clientX: 10, clientY: 10 })
    fireEvent.mouseMove(canvas, { clientX: 50, clientY: 50 })
    fireEvent.mouseUp(canvas, { clientX: 50, clientY: 50 })

    // Should call setShapes to add the new line
    expect(setShapes).toHaveBeenCalled()
  })

  it('renders shapes correctly', () => {
    const shapes = [
      {
        id: 1,
        type: 'rectangle',
        coordinates: { startX: 10, startY: 10, endX: 50, endY: 50 }
      },
      {
        id: 2,
        type: 'line',
        coordinates: { startX: 0, startY: 0, endX: 100, endY: 100 }
      }
    ]

    render(<Canvas {...defaultProps} shapes={shapes} />)

    // Canvas should be rendered with shapes
    const canvas = document.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
  })
})
