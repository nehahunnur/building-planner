import React, { useState, useEffect } from 'react';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import DrawingList from './components/DrawingList';
import { getDrawings, saveDrawing, updateDrawing, loadDrawing, deleteDrawing } from './services/api';
import './App.css';

function BuildingPlanner() {
  const [activeTool, setActiveTool] = useState('select');
  const [currentDrawing, setCurrentDrawing] = useState(null);
  const [drawings, setDrawings] = useState([]);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [shapes, setShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);

  // Load drawings on component mount
  useEffect(() => {
    loadDrawings();
  }, []);

  const loadDrawings = async () => {
    try {
      const response = await getDrawings();
      setDrawings(response.data);
    } catch (error) {
      console.error('Error loading drawings:', error);
    }
  };

  const createNewDrawing = async () => {
    const name = prompt('Enter drawing name:');
    if (!name) return;

    try {
      const response = await saveDrawing({ name, description: '' });
      const newDrawing = response.data;
      setCurrentDrawing(newDrawing);
      setShapes([]);
      setDrawings([...drawings, newDrawing]);
    } catch (error) {
      console.error('Error creating drawing:', error);
    }
  };

  const openDrawing = async (drawingId) => {
    try {
      const response = await loadDrawing(drawingId);
      const drawing = response.data;
      setCurrentDrawing(drawing);
      setShapes(drawing.shapes || []);
    } catch (error) {
      console.error('Error loading drawing:', error);
    }
  };

  const saveCurrentDrawing = async () => {
    if (!currentDrawing) return;

    try {
      await updateDrawing(currentDrawing.id, {
        ...currentDrawing,
        shapes: shapes
      });
      alert('Drawing saved successfully!');
    } catch (error) {
      console.error('Error saving drawing:', error);
      alert('Error saving drawing');
    }
  };

  const deleteCurrentDrawing = async () => {
    if (!currentDrawing) return;

    if (confirm('Are you sure you want to delete this drawing?')) {
      try {
        await deleteDrawing(currentDrawing.id);
        setCurrentDrawing(null);
        setShapes([]);
        loadDrawings();
      } catch (error) {
        console.error('Error deleting drawing:', error);
      }
    }
  };

  return (
    <div className="building-planner">
      <header className="header">
        <h1>Building Planner</h1>
        <div className="header-controls">
          <button onClick={createNewDrawing} className="btn btn-primary">
            New Drawing
          </button>
          {currentDrawing && (
            <>
              <button onClick={saveCurrentDrawing} className="btn btn-success">
                Save Drawing
              </button>
              <button onClick={deleteCurrentDrawing} className="btn btn-danger">
                Delete Drawing
              </button>
              <span className="current-drawing">
                Current: {currentDrawing.name}
              </span>
            </>
          )}
        </div>
      </header>

      <div className="main-content">
        <div className="sidebar">
          <Toolbar activeTool={activeTool} setActiveTool={setActiveTool} />

          <div className="view-controls">
            <h3>View Options</h3>
            <label>
              <input
                type="checkbox"
                checked={showAnnotations}
                onChange={(e) => setShowAnnotations(e.target.checked)}
              />
              Show Annotations
            </label>
          </div>

          <DrawingList
            drawings={drawings}
            onSelectDrawing={openDrawing}
            currentDrawing={currentDrawing}
          />
        </div>

        <div className="canvas-area">
          {currentDrawing ? (
            <Canvas
              activeTool={activeTool}
              shapes={shapes}
              setShapes={setShapes}
              showAnnotations={showAnnotations}
              selectedShape={selectedShape}
              setSelectedShape={setSelectedShape}
            />
          ) : (
            <div className="no-drawing">
              <h2>No Drawing Selected</h2>
              <p>Create a new drawing or select an existing one to start.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BuildingPlanner;