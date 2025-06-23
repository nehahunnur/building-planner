import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { getDrawings, saveDrawing, updateDrawing, loadDrawing, deleteDrawing } from '../services/api'

// Mock axios
vi.mock('axios')

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getDrawings', () => {
    it('fetches all drawings', async () => {
      const mockData = [
        { id: 1, name: 'Drawing 1' },
        { id: 2, name: 'Drawing 2' }
      ]
      
      axios.get.mockResolvedValue({ data: mockData })
      
      const result = await getDrawings()
      
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/api/drawings')
      expect(result.data).toEqual(mockData)
    })
  })

  describe('loadDrawing', () => {
    it('fetches a specific drawing', async () => {
      const mockDrawing = {
        id: 1,
        name: 'Test Drawing',
        shapes: []
      }
      
      axios.get.mockResolvedValue({ data: mockDrawing })
      
      const result = await loadDrawing(1)
      
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/api/drawings/1')
      expect(result.data).toEqual(mockDrawing)
    })
  })

  describe('saveDrawing', () => {
    it('creates a new drawing', async () => {
      const drawingData = {
        name: 'New Drawing',
        description: 'Test description'
      }
      
      const mockResponse = {
        id: 1,
        ...drawingData,
        shapes: []
      }
      
      axios.post.mockResolvedValue({ data: mockResponse })
      
      const result = await saveDrawing(drawingData)
      
      expect(axios.post).toHaveBeenCalledWith('http://localhost:3001/api/drawings', drawingData)
      expect(result.data).toEqual(mockResponse)
    })
  })

  describe('updateDrawing', () => {
    it('updates an existing drawing', async () => {
      const drawingData = {
        name: 'Updated Drawing',
        description: 'Updated description',
        shapes: [
          { id: 1, type: 'rectangle', coordinates: { startX: 0, startY: 0, endX: 100, endY: 100 } }
        ]
      }
      
      axios.put.mockResolvedValue({ data: { message: 'Drawing updated successfully' } })
      
      const result = await updateDrawing(1, drawingData)
      
      expect(axios.put).toHaveBeenCalledWith('http://localhost:3001/api/drawings/1', drawingData)
      expect(result.data.message).toBe('Drawing updated successfully')
    })
  })

  describe('deleteDrawing', () => {
    it('deletes a drawing', async () => {
      axios.delete.mockResolvedValue({ data: { message: 'Drawing deleted successfully' } })
      
      const result = await deleteDrawing(1)
      
      expect(axios.delete).toHaveBeenCalledWith('http://localhost:3001/api/drawings/1')
      expect(result.data.message).toBe('Drawing deleted successfully')
    })
  })
})
