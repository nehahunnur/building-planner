import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BuildingPlanner from '../BuildingPlanner'
import * as api from '../services/api'

// Mock the API module
vi.mock('../services/api', () => ({
  getDrawings: vi.fn(),
  saveDrawing: vi.fn(),
  updateDrawing: vi.fn(),
  loadDrawing: vi.fn(),
  deleteDrawing: vi.fn(),
}))

describe('BuildingPlanner', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
    
    // Mock successful API responses
    api.getDrawings.mockResolvedValue({ data: [] })
    api.saveDrawing.mockResolvedValue({ 
      data: { id: 1, name: 'Test Drawing', shapes: [] } 
    })
  })

  it('renders the main components', () => {
    render(<BuildingPlanner />)
    
    expect(screen.getByText('Building Planner')).toBeInTheDocument()
    expect(screen.getByText('New Drawing')).toBeInTheDocument()
    expect(screen.getByText('Drawing Tools')).toBeInTheDocument()
    expect(screen.getByText('No Drawing Selected')).toBeInTheDocument()
  })

  it('shows toolbar with drawing tools', () => {
    render(<BuildingPlanner />)
    
    expect(screen.getByText('Select')).toBeInTheDocument()
    expect(screen.getByText('Line')).toBeInTheDocument()
    expect(screen.getByText('Rectangle')).toBeInTheDocument()
    expect(screen.getByText('Circle')).toBeInTheDocument()
    expect(screen.getByText('Polygon')).toBeInTheDocument()
    expect(screen.getByText('Arrow')).toBeInTheDocument()
  })

  it('shows view controls', () => {
    render(<BuildingPlanner />)
    
    expect(screen.getByText('View Options')).toBeInTheDocument()
    expect(screen.getByText('Show Annotations')).toBeInTheDocument()
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  it('creates a new drawing when button is clicked', async () => {
    // Mock window.prompt
    global.prompt = vi.fn(() => 'New Test Drawing')
    
    render(<BuildingPlanner />)
    
    const newDrawingButton = screen.getByText('New Drawing')
    fireEvent.click(newDrawingButton)
    
    await waitFor(() => {
      expect(api.saveDrawing).toHaveBeenCalledWith({
        name: 'New Test Drawing',
        description: ''
      })
    })
  })

  it('does not create drawing if name is not provided', async () => {
    // Mock window.prompt to return null (user cancelled)
    global.prompt = vi.fn(() => null)
    
    render(<BuildingPlanner />)
    
    const newDrawingButton = screen.getByText('New Drawing')
    fireEvent.click(newDrawingButton)
    
    expect(api.saveDrawing).not.toHaveBeenCalled()
  })

  it('toggles annotations visibility', () => {
    render(<BuildingPlanner />)
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
    
    fireEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
    
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('loads drawings on mount', async () => {
    const mockDrawings = [
      { id: 1, name: 'Drawing 1', created_at: '2025-06-23T10:00:00Z' },
      { id: 2, name: 'Drawing 2', created_at: '2025-06-23T11:00:00Z' }
    ]
    
    api.getDrawings.mockResolvedValue({ data: mockDrawings })
    
    render(<BuildingPlanner />)
    
    await waitFor(() => {
      expect(api.getDrawings).toHaveBeenCalled()
    })
  })
})
