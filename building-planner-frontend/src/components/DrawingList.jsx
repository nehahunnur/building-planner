import React from 'react';

function DrawingList({ drawings, onSelectDrawing, currentDrawing }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="drawing-list">
      <h3>Saved Drawings</h3>
      {drawings.length === 0 ? (
        <p className="no-drawings">No drawings found. Create your first drawing!</p>
      ) : (
        <ul className="drawings-list">
          {drawings.map(drawing => (
            <li
              key={drawing.id}
              onClick={() => onSelectDrawing(drawing.id)}
              className={`drawing-item ${currentDrawing?.id === drawing.id ? 'active' : ''}`}
            >
              <div className="drawing-info">
                <span className="drawing-name">{drawing.name}</span>
                <span className="drawing-date">{formatDate(drawing.created_at)}</span>
                {drawing.description && (
                  <span className="drawing-description">{drawing.description}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DrawingList;
