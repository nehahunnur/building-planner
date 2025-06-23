import React from 'react';

function Toolbar({ activeTool, setActiveTool }) {
  const tools = [
    { id: 'select', name: 'Select', icon: '🔍', description: 'Select and move shapes' },
    { id: 'line', name: 'Line', icon: '📏', description: 'Draw straight lines' },
    { id: 'rectangle', name: 'Rectangle', icon: '⬜', description: 'Draw rectangles' },
    { id: 'circle', name: 'Circle', icon: '⭕', description: 'Draw circles' },
    { id: 'polygon', name: 'Polygon', icon: '🔷', description: 'Draw polygons' },
    { id: 'arrow', name: 'Arrow', icon: '➡️', description: 'Draw arrows' }
  ];

  return (
    <div className="toolbar">
      <h3>Drawing Tools</h3>
      <div className="tool-buttons">
        {tools.map(tool => (
          <button
            key={tool.id}
            className={activeTool === tool.id ? 'active' : ''}
            onClick={() => setActiveTool(tool.id)}
            title={tool.description}
          >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-name">{tool.name}</span>
          </button>
        ))}
      </div>

      <div className="tool-info">
        <h4>Current Tool</h4>
        <p>{tools.find(t => t.id === activeTool)?.description || 'No tool selected'}</p>
      </div>
    </div>
  );
}

export default Toolbar;
