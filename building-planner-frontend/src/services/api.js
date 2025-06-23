import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Get all drawings
export const getDrawings = async () => {
  return await axios.get(`${API_URL}/drawings`);
};

// Get a specific drawing
export const loadDrawing = async (id) => {
  return await axios.get(`${API_URL}/drawings/${id}`);
};

// Create a new drawing
export const saveDrawing = async (drawingData) => {
  return await axios.post(`${API_URL}/drawings`, drawingData);
};

// Update an existing drawing
export const updateDrawing = async (id, drawingData) => {
  return await axios.put(`${API_URL}/drawings/${id}`, drawingData);
};

// Delete a drawing
export const deleteDrawing = async (id) => {
  return await axios.delete(`${API_URL}/drawings/${id}`);
};
