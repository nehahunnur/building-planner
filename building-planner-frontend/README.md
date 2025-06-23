# Building Planner Frontend

React-based frontend application for the Building Planner, featuring an intuitive drawing interface with HTML5 Canvas and comprehensive shape management tools.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## 🎨 Features

### Drawing Interface
- **HTML5 Canvas**: High-performance drawing surface
- **Multi-tool Support**: Lines, rectangles, circles, polygons, arrows
- **Shape Selection**: Click to select, drag to move, resize with handles
- **Real-time Annotations**: Automatic measurements and dimensions

### User Experience
- **Responsive Design**: Works on desktop and tablet devices
- **Intuitive Controls**: Easy-to-use toolbar and canvas interactions
- **Visual Feedback**: Clear indicators for active tools and selected shapes

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast development and build tool
- **Axios**: HTTP client for API communication
- **HTML5 Canvas**: Native drawing capabilities
- **Vitest**: Fast unit testing framework

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Canvas.jsx       # Main drawing canvas
│   ├── Toolbar.jsx      # Drawing tools toolbar
│   └── DrawingList.jsx  # Saved drawings list
├── services/            # API and external services
│   └── api.js          # Backend API client
├── test/               # Test files
├── App.css             # Global styles
├── main.jsx            # Application entry point
└── BuildingPlanner.jsx # Main application component
```

## 🎯 Drawing System

### Shape Types
- **Line**: Straight lines with length annotations
- **Rectangle**: Rectangles with width/height dimensions
- **Circle**: Circles with radius measurements
- **Polygon**: Custom polygons with area calculations
- **Arrow**: Directional arrows with length annotations

### Shape Management
- **Selection**: Click shapes to select them
- **Movement**: Drag selected shapes to move
- **Resizing**: Use blue handles to resize shapes
- **Deletion**: Press Delete key to remove selected shapes

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui
```

### Test Coverage
- Component rendering tests
- User interaction tests
- API integration tests
- Canvas drawing functionality tests

## 🔧 Configuration

### Environment Variables
Create `.env` file:
```
VITE_API_URL=http://localhost:3001/api
```

### Vite Configuration
- React plugin for JSX support
- Development server on port 5177
- Test environment with jsdom
- Hot module replacement enabled

## 🎨 Usage Guide

### Creating Drawings
1. Click "New Drawing" button
2. Enter a name for your drawing
3. Select a tool from the toolbar
4. Click and drag on canvas to create shapes

### Drawing Tools
- **Select**: Click to select shapes, drag to move, use handles to resize
- **Line**: Click and drag to draw straight lines
- **Rectangle**: Click and drag to draw rectangles
- **Circle**: Click and drag to draw circles
- **Polygon**: Click to add points, click near first point to complete
- **Arrow**: Click and drag to draw directional arrows

### Annotations
- Toggle "Show Annotations" to display measurements
- Automatic calculations for length, area, radius, and dimensions

### Keyboard Shortcuts
- **Delete**: Remove selected shape
- **Escape**: Cancel current operation or deselect
- **Enter**: Complete polygon drawing

## 🚀 Performance

- Canvas rendering optimizations
- Efficient shape caching
- Debounced API calls
- React.memo for optimized re-rendering

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires Canvas API and modern JavaScript features.

## 🤝 Contributing

1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass

## 📝 License

MIT License - see LICENSE file for details

