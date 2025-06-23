import React, { useRef, useEffect, useState } from 'react';

function Canvas({
  activeTool,
  shapes,
  setShapes,
  showAnnotations,
  selectedShape,
  setSelectedShape
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [cursor, setCursor] = useState('default');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all shapes
    shapes.forEach(shape => {
      drawShape(ctx, shape, shape.id === selectedShape?.id);
    });

    // Draw annotations if enabled
    if (showAnnotations) {
      shapes.forEach(shape => {
        drawAnnotations(ctx, shape);
      });
    }
  }, [shapes, selectedShape, showAnnotations]);

  const drawShape = (ctx, shape, isSelected = false) => {
    ctx.beginPath();
    ctx.strokeStyle = isSelected ? '#007bff' : '#000';
    ctx.lineWidth = isSelected ? 3 : 2;

    const coords = shape.coordinates || shape;

    switch(shape.type) {
      case 'line':
        ctx.moveTo(coords.startX, coords.startY);
        ctx.lineTo(coords.endX, coords.endY);
        break;
      case 'rectangle':
        ctx.rect(
          coords.startX,
          coords.startY,
          coords.endX - coords.startX,
          coords.endY - coords.startY
        );
        break;
      case 'circle':
        const radius = Math.sqrt(
          Math.pow(coords.endX - coords.startX, 2) +
          Math.pow(coords.endY - coords.startY, 2)
        );
        ctx.arc(coords.startX, coords.startY, radius, 0, 2 * Math.PI);
        break;
      case 'arrow':
        drawArrow(ctx, coords.startX, coords.startY, coords.endX, coords.endY);
        break;
      case 'polygon':
        if (coords.points && coords.points.length > 2) {
          ctx.moveTo(coords.points[0].x, coords.points[0].y);
          for (let i = 1; i < coords.points.length; i++) {
            ctx.lineTo(coords.points[i].x, coords.points[i].y);
          }
          ctx.closePath();
        }
        break;
      default:
        break;
    }

    ctx.stroke();

    // Draw selection handles if selected
    if (isSelected) {
      drawSelectionHandles(ctx, coords, shape.type);
    }
  };

  const drawArrow = (ctx, startX, startY, endX, endY) => {
    const headLength = 15;
    const angle = Math.atan2(endY - startY, endX - startX);

    // Draw the line
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);

    // Draw the arrowhead
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(angle - Math.PI / 6),
      endY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(angle + Math.PI / 6),
      endY - headLength * Math.sin(angle + Math.PI / 6)
    );
  };

  const drawSelectionHandles = (ctx, coords, type) => {
    ctx.fillStyle = '#007bff';
    const handleSize = 6;

    if (type === 'line' || type === 'arrow') {
      // Draw handles at line endpoints
      ctx.fillRect(coords.startX - handleSize/2, coords.startY - handleSize/2, handleSize, handleSize);
      ctx.fillRect(coords.endX - handleSize/2, coords.endY - handleSize/2, handleSize, handleSize);
    } else if (type === 'rectangle') {
      // Draw handles at rectangle corners
      ctx.fillRect(coords.startX - handleSize/2, coords.startY - handleSize/2, handleSize, handleSize);
      ctx.fillRect(coords.endX - handleSize/2, coords.startY - handleSize/2, handleSize, handleSize);
      ctx.fillRect(coords.startX - handleSize/2, coords.endY - handleSize/2, handleSize, handleSize);
      ctx.fillRect(coords.endX - handleSize/2, coords.endY - handleSize/2, handleSize, handleSize);
    } else if (type === 'circle') {
      // Draw handle at circle center and edge
      ctx.fillRect(coords.startX - handleSize/2, coords.startY - handleSize/2, handleSize, handleSize);
      ctx.fillRect(coords.endX - handleSize/2, coords.endY - handleSize/2, handleSize, handleSize);
    } else if (type === 'polygon' && coords.points) {
      // Draw handles at polygon vertices
      coords.points.forEach(point => {
        ctx.fillRect(point.x - handleSize/2, point.y - handleSize/2, handleSize, handleSize);
      });
    }
  };

  const drawAnnotations = (ctx, shape) => {
    const coords = shape.coordinates || shape;
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';

    if (shape.type === 'line' || shape.type === 'arrow') {
      const length = Math.sqrt(
        Math.pow(coords.endX - coords.startX, 2) +
        Math.pow(coords.endY - coords.startY, 2)
      );
      const midX = (coords.startX + coords.endX) / 2;
      const midY = (coords.startY + coords.endY) / 2;
      ctx.fillText(`${Math.round(length)}px`, midX + 5, midY - 5);
    } else if (shape.type === 'rectangle') {
      const width = Math.abs(coords.endX - coords.startX);
      const height = Math.abs(coords.endY - coords.startY);
      ctx.fillText(`${Math.round(width)}×${Math.round(height)}px`, coords.startX, coords.startY - 5);
    } else if (shape.type === 'circle') {
      const radius = Math.sqrt(
        Math.pow(coords.endX - coords.startX, 2) +
        Math.pow(coords.endY - coords.startY, 2)
      );
      ctx.fillText(`r=${Math.round(radius)}px`, coords.startX + 5, coords.startY - 5);
    } else if (shape.type === 'polygon' && coords.points && coords.points.length > 2) {
      // Calculate polygon area using shoelace formula
      let area = 0;
      for (let i = 0; i < coords.points.length; i++) {
        const j = (i + 1) % coords.points.length;
        area += coords.points[i].x * coords.points[j].y;
        area -= coords.points[j].x * coords.points[i].y;
      }
      area = Math.abs(area) / 2;

      // Find centroid for label placement
      let centroidX = 0, centroidY = 0;
      coords.points.forEach(point => {
        centroidX += point.x;
        centroidY += point.y;
      });
      centroidX /= coords.points.length;
      centroidY /= coords.points.length;

      ctx.fillText(`Area: ${Math.round(area)}px²`, centroidX + 5, centroidY - 5);
    }
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const isPointInShape = (point, shape) => {
    const coords = shape.coordinates || shape;
    const tolerance = 10;

    switch(shape.type) {
      case 'line':
        // Check if point is near the line
        const lineLength = Math.sqrt(
          Math.pow(coords.endX - coords.startX, 2) +
          Math.pow(coords.endY - coords.startY, 2)
        );
        const distToStart = Math.sqrt(
          Math.pow(point.x - coords.startX, 2) +
          Math.pow(point.y - coords.startY, 2)
        );
        const distToEnd = Math.sqrt(
          Math.pow(point.x - coords.endX, 2) +
          Math.pow(point.y - coords.endY, 2)
        );
        return Math.abs(distToStart + distToEnd - lineLength) < tolerance;

      case 'rectangle':
        return point.x >= Math.min(coords.startX, coords.endX) - tolerance &&
               point.x <= Math.max(coords.startX, coords.endX) + tolerance &&
               point.y >= Math.min(coords.startY, coords.endY) - tolerance &&
               point.y <= Math.max(coords.startY, coords.endY) + tolerance;

      case 'circle':
        const radius = Math.sqrt(
          Math.pow(coords.endX - coords.startX, 2) +
          Math.pow(coords.endY - coords.startY, 2)
        );
        const distToCenter = Math.sqrt(
          Math.pow(point.x - coords.startX, 2) +
          Math.pow(point.y - coords.startY, 2)
        );
        return Math.abs(distToCenter - radius) < tolerance;

      default:
        return false;
    }
  };

  const getResizeHandle = (point, shape) => {
    if (!shape) return null;

    const coords = shape.coordinates || shape;
    const handleSize = 6;
    const tolerance = handleSize + 2;

    const isNearPoint = (px, py) => {
      return Math.abs(point.x - px) <= tolerance && Math.abs(point.y - py) <= tolerance;
    };

    if (shape.type === 'rectangle') {
      if (isNearPoint(coords.startX, coords.startY)) return 'top-left';
      if (isNearPoint(coords.endX, coords.startY)) return 'top-right';
      if (isNearPoint(coords.startX, coords.endY)) return 'bottom-left';
      if (isNearPoint(coords.endX, coords.endY)) return 'bottom-right';
    } else if (shape.type === 'line' || shape.type === 'arrow') {
      if (isNearPoint(coords.startX, coords.startY)) return 'start';
      if (isNearPoint(coords.endX, coords.endY)) return 'end';
    } else if (shape.type === 'circle') {
      if (isNearPoint(coords.startX, coords.startY)) return 'center';
      if (isNearPoint(coords.endX, coords.endY)) return 'radius';
    }

    return null;
  };

  const handleMouseDown = (e) => {
    const mousePos = getMousePos(e);

    if (activeTool === 'select') {
      // First check if clicking on a resize handle of selected shape
      if (selectedShape) {
        const handle = getResizeHandle(mousePos, selectedShape);
        if (handle) {
          setIsResizing(true);
          setResizeHandle(handle);
          return;
        }
      }

      // Check if clicking on a shape
      const clickedShape = shapes.find(shape => isPointInShape(mousePos, shape));

      if (clickedShape) {
        setSelectedShape(clickedShape);
        setIsDragging(true);
        const coords = clickedShape.coordinates || clickedShape;
        setDragOffset({
          x: mousePos.x - coords.startX,
          y: mousePos.y - coords.startY
        });
      } else {
        setSelectedShape(null);
      }
      return;
    }

    if (activeTool === 'polygon') {
      // Handle polygon drawing with multiple clicks
      if (!window.polygonPoints) {
        window.polygonPoints = [];
      }

      // Check if clicking near the first point to close polygon
      if (window.polygonPoints.length > 2) {
        const firstPoint = window.polygonPoints[0];
        const distance = Math.sqrt(
          Math.pow(mousePos.x - firstPoint.x, 2) +
          Math.pow(mousePos.y - firstPoint.y, 2)
        );

        if (distance < 15) {
          // Close the polygon
          const newShape = {
            id: Date.now(),
            type: 'polygon',
            coordinates: {
              points: [...window.polygonPoints]
            },
            properties: {},
            annotations: {}
          };

          setShapes([...shapes, newShape]);
          window.polygonPoints = [];
          return;
        }
      }

      // Add point to polygon
      window.polygonPoints.push(mousePos);
      return;
    }

    // Drawing mode for other tools
    setIsDrawing(true);
    setStartPoint(mousePos);
  };

  const handleMouseMove = (e) => {
    const mousePos = getMousePos(e);

    if (isResizing && selectedShape && resizeHandle) {
      // Resize selected shape
      const coords = selectedShape.coordinates || selectedShape;
      let updatedCoords = { ...coords };

      switch (resizeHandle) {
        case 'top-left':
          updatedCoords.startX = mousePos.x;
          updatedCoords.startY = mousePos.y;
          break;
        case 'top-right':
          updatedCoords.endX = mousePos.x;
          updatedCoords.startY = mousePos.y;
          break;
        case 'bottom-left':
          updatedCoords.startX = mousePos.x;
          updatedCoords.endY = mousePos.y;
          break;
        case 'bottom-right':
          updatedCoords.endX = mousePos.x;
          updatedCoords.endY = mousePos.y;
          break;
        case 'start':
          updatedCoords.startX = mousePos.x;
          updatedCoords.startY = mousePos.y;
          break;
        case 'end':
          updatedCoords.endX = mousePos.x;
          updatedCoords.endY = mousePos.y;
          break;
        case 'center':
          const deltaX = mousePos.x - coords.startX;
          const deltaY = mousePos.y - coords.startY;
          updatedCoords.startX = mousePos.x;
          updatedCoords.startY = mousePos.y;
          updatedCoords.endX = coords.endX + deltaX;
          updatedCoords.endY = coords.endY + deltaY;
          break;
        case 'radius':
          updatedCoords.endX = mousePos.x;
          updatedCoords.endY = mousePos.y;
          break;
      }

      const updatedShape = {
        ...selectedShape,
        coordinates: updatedCoords
      };

      const updatedShapes = shapes.map(shape =>
        shape.id === selectedShape.id ? updatedShape : shape
      );
      setShapes(updatedShapes);
      setSelectedShape(updatedShape);
      return;
    }

    if (isDragging && selectedShape && activeTool === 'select') {
      // Move selected shape
      const coords = selectedShape.coordinates || selectedShape;
      const deltaX = mousePos.x - dragOffset.x - coords.startX;
      const deltaY = mousePos.y - dragOffset.y - coords.startY;

      const updatedShape = {
        ...selectedShape,
        coordinates: {
          ...coords,
          startX: coords.startX + deltaX,
          startY: coords.startY + deltaY,
          endX: coords.endX + deltaX,
          endY: coords.endY + deltaY
        }
      };

      const updatedShapes = shapes.map(shape =>
        shape.id === selectedShape.id ? updatedShape : shape
      );
      setShapes(updatedShapes);
      setSelectedShape(updatedShape);
      return;
    }

    // Update cursor based on hover state
    if (activeTool === 'select' && selectedShape && !isDragging && !isResizing) {
      const handle = getResizeHandle(mousePos, selectedShape);
      if (handle) {
        const cursorMap = {
          'top-left': 'nw-resize',
          'top-right': 'ne-resize',
          'bottom-left': 'sw-resize',
          'bottom-right': 'se-resize',
          'start': 'move',
          'end': 'move',
          'center': 'move',
          'radius': 'move'
        };
        setCursor(cursorMap[handle] || 'move');
      } else if (isPointInShape(mousePos, selectedShape)) {
        setCursor('move');
      } else {
        setCursor('default');
      }
    } else {
      setCursor(activeTool === 'select' ? 'default' : 'crosshair');
    }

    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas and redraw all shapes
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => drawShape(ctx, shape, shape.id === selectedShape?.id));

    // Draw current shape being created
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    switch(activeTool) {
      case 'line':
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        break;
      case 'rectangle':
        ctx.rect(
          startPoint.x,
          startPoint.y,
          mousePos.x - startPoint.x,
          mousePos.y - startPoint.y
        );
        break;
      case 'circle':
        const radius = Math.sqrt(
          Math.pow(mousePos.x - startPoint.x, 2) +
          Math.pow(mousePos.y - startPoint.y, 2)
        );
        ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
        break;
      case 'arrow':
        drawArrow(ctx, startPoint.x, startPoint.y, mousePos.x, mousePos.y);
        break;
      case 'polygon':
        // For polygon, we'll handle this differently - show current line being drawn
        if (window.polygonPoints && window.polygonPoints.length > 0) {
          const points = window.polygonPoints;
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
          }
          // Draw line to current mouse position
          ctx.lineTo(mousePos.x, mousePos.y);
        }
        break;
      default:
        break;
    }

    ctx.stroke();
  };

  const handleMouseUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      return;
    }

    if (isResizing) {
      setIsResizing(false);
      setResizeHandle(null);
      return;
    }

    if (!isDrawing || activeTool === 'polygon') return;

    const mousePos = getMousePos(e);

    // Don't create shapes that are too small
    const minDistance = 5;
    const distance = Math.sqrt(
      Math.pow(mousePos.x - startPoint.x, 2) +
      Math.pow(mousePos.y - startPoint.y, 2)
    );

    if (distance < minDistance) {
      setIsDrawing(false);
      return;
    }

    // Add new shape
    const newShape = {
      id: Date.now(),
      type: activeTool,
      coordinates: {
        startX: startPoint.x,
        startY: startPoint.y,
        endX: mousePos.x,
        endY: mousePos.y
      },
      properties: {},
      annotations: {}
    };

    setShapes([...shapes, newShape]);
    setIsDrawing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Delete' && selectedShape) {
      const updatedShapes = shapes.filter(shape => shape.id !== selectedShape.id);
      setShapes(updatedShapes);
      setSelectedShape(null);
    } else if (e.key === 'Escape') {
      // Cancel current polygon drawing
      if (activeTool === 'polygon' && window.polygonPoints) {
        window.polygonPoints = [];
      }
      // Deselect current shape
      setSelectedShape(null);
      setIsDrawing(false);
    } else if (e.key === 'Enter' && activeTool === 'polygon' && window.polygonPoints && window.polygonPoints.length > 2) {
      // Complete polygon with Enter key
      const newShape = {
        id: Date.now(),
        type: 'polygon',
        coordinates: {
          points: [...window.polygonPoints]
        },
        properties: {},
        annotations: {}
      };

      setShapes([...shapes, newShape]);
      window.polygonPoints = [];
    }
  };

  // Add keyboard event listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.tabIndex = 0; // Make canvas focusable
      canvas.addEventListener('keydown', handleKeyDown);
      return () => canvas.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedShape, shapes]);

  return (
    <div className="canvas-container">
      <div className="canvas-header">
        <h3>Drawing Canvas</h3>
        {selectedShape && (
          <div className="shape-info">
            <span>Selected: {selectedShape.type}</span>
            <button onClick={() => setSelectedShape(null)}>Deselect</button>
          </div>
        )}
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          border: '2px solid #ddd',
          backgroundColor: '#fafafa',
          cursor: cursor
        }}
      />
      <div className="canvas-footer">
        <small>
          {activeTool === 'select'
            ? 'Click shapes to select, drag to move, press Delete to remove'
            : activeTool === 'polygon'
            ? 'Click to add points, click near first point or press Enter to complete, Escape to cancel'
            : `Click and drag to draw ${activeTool}`
          }
          {window.polygonPoints && window.polygonPoints.length > 0 && (
            <span style={{ marginLeft: '10px', color: '#007bff' }}>
              Polygon: {window.polygonPoints.length} points
            </span>
          )}
        </small>
      </div>
    </div>
  );
}

export default Canvas;