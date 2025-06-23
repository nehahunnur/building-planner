import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

function CanvasArea({ activeTool, drawingId }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [shapes, setShapes] = useState([]);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  
  // Load drawing if drawingId is provided
  useEffect(() => {
    if (drawingId) {
      const fetchDrawing = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/drawings/${drawingId}`);
          if (response.data && response.data.shapes) {
            setShapes(response.data.shapes);
          }
        } catch (error) {
          console.error('Error loading drawing:', error);
        }
      };
      
      fetchDrawing();
    }
  }, [drawingId]);
  
  // Draw all shapes on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all shapes
    shapes.forEach((shape, index) => {
      const isSelected = index === selectedShapeIndex;
      
      ctx.strokeStyle = isSelected ? 'blue' : 'black';
      ctx.lineWidth = isSelected ? 3 : 2;
      
      switch (shape.type) {
        case 'line':
          drawLine(ctx, shape.x1, shape.y1, shape.x2, shape.y2);
          break;
        case 'rectangle':
          drawRectangle(ctx, shape.x, shape.y, shape.width, shape.height);
          break;
        case 'circle':
          drawCircle(ctx, shape.x, shape.y, shape.radius);
          break;
      }
      
      // Draw annotations if enabled
      if (showAnnotations) {
        drawAnnotation(ctx, shape);
      }
    });
  }, [shapes, selectedShapeIndex, showAnnotations]);
  
  const drawLine = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };
  
  const drawRectangle = (ctx, x, y, width, height) => {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke();
  };
  
  const drawCircle = (ctx, x, y, radius) => {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
  };
  
  const drawAnnotation = (ctx, shape) => {
    ctx.font = '12px Arial';
    ctx.fillStyle = 'black';
    
    switch (shape.type) {
      case 'line':
        const length = Math.sqrt(
          Math.pow(shape.x2 - shape.x1, 2) + Math.pow(shape.y2 - shape.y1, 2)
        ).toFixed(2);
        ctx.fillText(`${length}px`, (shape.x1 + shape.x2) / 2, (shape.y1 + shape.y2) / 2);
        break;
      case 'rectangle':
        ctx.fillText(
          `${shape.width}x${shape.height}`, 
          shape.x + shape.width / 2, 
          shape.y + shape.height / 2
        );
        break;
      case 'circle':
        ctx.fillText(
          `r=${shape.radius}`, 
          shape.x, 
          shape.y
        );
        break;
    }
  };
  
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (activeTool === 'select') {
      // Check if clicking on a shape
      for (let i = shapes.length - 1; i >= 0; i--) {
        if (isPointInShape(x, y, shapes[i])) {
          setSelectedShapeIndex(i);
          return;
        }
      }
      setSelectedShapeIndex(null);
    } else {
      setIsDrawing(true);
      setStartPoint({ x, y });
    }
  };
  
  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Clear canvas and redraw all shapes
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all existing shapes
    shapes.forEach((shape, index) => {
      const isSelected = index === selectedShapeIndex;
      ctx.strokeStyle = isSelected ? 'blue' : 'black';
      ctx.lineWidth = isSelected ? 3 : 2;
      
      switch (shape.type) {
        case 'line':
          drawLine(ctx, shape.x1, shape.y1, shape.x2, shape.y2);
          break;
        case 'rectangle':
          drawRectangle(ctx, shape.x, shape.y, shape.width, shape.height);
          break;
        case 'circle':
          drawCircle(ctx, shape.x, shape.y, shape.radius);
          break;
      }
      
      if (showAnnotations) {
        drawAnnotation(ctx, shape);
      }
    });
    
    // Draw the shape being created
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    
    switch (activeTool) {
      case 'line':
        drawLine(ctx, startPoint.x, startPoint.y, x, y);
        break;
      case 'rectangle':
        const width = x - startPoint.x;
        const height = y - startPoint.y;
        drawRectangle(ctx, startPoint.x, startPoint.y, width, height);
        break;
      case 'circle':
        const radius = Math.sqrt(
          Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2)
        );
        drawCircle(ctx, startPoint.x, startPoint.y, radius);
        break;
    }
  };
  
  const handleMouseUp = () => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    let newShape;
    
    switch (activeTool) {
      case 'line':
        newShape = {
          type: 'line',
          x1: startPoint.x,
          y1: startPoint.y,
          x2: x,
          y2: y
        };
        break;
      case 'rectangle':
        newShape = {
          type: 'rectangle',
          x: startPoint.x,
          y: startPoint.y,
          width: x - startPoint.x,
          height: y - startPoint.y
        };
        break;
      case 'circle':
        const radius = Math.sqrt(
          Math.pow(x - startPoint.x, 2) + Math.pow(y - startPoint.y, 2)
        );
        newShape = {
          type: 'circle',
          x: startPoint.x,
          y: startPoint.y,
          radius
        };
        break;
    }
    
    if (newShape) {
      setShapes([...shapes, newShape]);
    }
    
    setIsDrawing(false);
  };
  
  const isPointInShape = (x, y, shape) => {
    switch (shape.type) {
      case 'line':
        // Check if point is near the line
        const lineDistance = distanceToLine(
          x, y, 
          shape.x1, shape.y1, 
          shape.x2, shape.y2
        );
        return lineDistance < 5; // 5px tolerance
        
      case 'rectangle':
        return (
          x >= shape.x && 
          x <= shape.x + shape.width && 
          y >= shape.y && 
          y <= shape.y + shape.height
        );
        
      case 'circle':
        const distance = Math.sqrt(
          Math.pow(x - shape.x, 2) + Math.pow(y - shape.y, 2)
        );
        return distance <= shape.radius;
        
      default:
        return false;
    }
  };
  
  const distanceToLine = (x, y, x1, y1, x2, y2) => {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) {
      param = dot / lenSq;
    }
    
    let xx, yy;
    
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    const dx = x - xx;
    const dy = y - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const handleSave = async () => {
    const drawingName = prompt('Enter a name for your drawing:');
    if (!drawingName) return;
    
    try {
      await axios.post('http://localhost:5000/api/drawings', {
        name: drawingName,
        shapes
      });
      alert('Drawing saved successfully!');
    } catch (error) {
      console.error('Error saving drawing:', error);
      alert('Failed to save drawing');
    }
  };
  
  const handleDelete = () => {
    if (selectedShapeIndex === null) return;
    
    const newShapes = [...shapes];
    newShapes.splice(selectedShapeIndex, 1);
    setShapes(newShapes);
    setSelectedShapeIndex(null);
  };
  
  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ 
          border: '1px solid #ccc', 
          cursor: activeTool === 'select' ? 'pointer' : 'crosshair'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      ></canvas>
      
      <div className="canvas-controls">
        <button onClick={() => setShowAnnotations(prev => !prev)}>
          {showAnnotations ? 'Hide Annotations' : 'Show Annotations'}
        </button>
        <button onClick={handleSave}>Save Drawing</button>
        <button 
          onClick={handleDelete} 
          disabled={selectedShapeIndex === null}
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
}

export default CanvasArea;
