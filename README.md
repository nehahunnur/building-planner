# Building Planner 🏗️

A modern web application for creating, editing, and managing building plans with an intuitive drawing interface and comprehensive annotation system.

## 🚀 Features

### Drawing Tools
- **Select Tool**: Select, move, resize, and delete shapes
- **Line Tool**: Draw straight lines with length annotations
- **Rectangle Tool**: Draw rectangles with dimension annotations
- **Circle Tool**: Draw circles with radius annotations
- **Polygon Tool**: Draw custom polygons with area calculations
- **Arrow Tool**: Draw directional arrows

### Annotations System
- **Automatic Measurements**: Length, width, height, radius, and area calculations
- **Toggle Visibility**: Show/hide annotations as needed
- **Real-time Updates**: Measurements update automatically when shapes are modified

### Data Persistence
- **Save Drawings**: Store drawings with all shapes and annotations
- **Load Drawings**: Retrieve and continue working on saved drawings
- **Delete Drawings**: Remove unwanted drawings
- **SQLite Database**: Reliable local data storage

### User Interface
- **Minimal Design**: Clean, distraction-free interface
- **Responsive Layout**: Works on different screen sizes
- **Intuitive Controls**: Easy-to-use toolbar and canvas
- **Visual Feedback**: Clear indicators for selected tools and shapes

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **Vite**: Fast development and build tool
- **HTML5 Canvas**: High-performance drawing surface
- **Axios**: HTTP client for API communication
- **CSS3**: Custom styling with modern features

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **SQLite3**: Lightweight database
- **CORS**: Cross-origin resource sharing
- **RESTful API**: Clean API design

### Testing
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **Jest DOM**: Additional DOM testing matchers

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Backend Setup
```bash
# Navigate to backend directory
cd building-planner-backend

# Install dependencies
npm install

# Start development server
npm run dev
```

The backend server will start on `http://localhost:3001`

### Frontend Setup
```bash
# Navigate to frontend directory
cd building-planner-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend application will start on `http://localhost:5177`

## 🧪 Testing

### Run Frontend Tests
```bash
cd building-planner-frontend
npm test
```

### Run Tests with UI
```bash
cd building-planner-frontend
npm run test:ui
```

## 🏗️ Build for Production

### Frontend Build
```bash
cd building-planner-frontend
npm run build
```

### Backend Production
```bash
cd building-planner-backend
npm start
```

## 📖 Usage Guide

### Creating a New Drawing
1. Click "New Drawing" button
2. Enter a name for your drawing
3. Start drawing using the toolbar tools

### Drawing Shapes
1. Select a tool from the toolbar (Line, Rectangle, Circle, etc.)
2. Click and drag on the canvas to create shapes
3. For polygons: Click to add points, click near the first point or press Enter to complete

### Selecting and Editing Shapes
1. Click the "Select" tool
2. Click on any shape to select it
3. Drag to move the shape
4. Drag the blue handles to resize
5. Press Delete key to remove selected shape

### Managing Drawings
- **Save**: Click "Save Drawing" to persist changes
- **Load**: Select a drawing from the sidebar list
- **Delete**: Click "Delete Drawing" to remove current drawing

### Annotations
- Toggle "Show Annotations" checkbox to show/hide measurements
- Annotations automatically display relevant measurements for each shape type

## 🏛️ Architecture

### Database Schema
```sql
-- Drawings table
CREATE TABLE drawings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Shapes table
CREATE TABLE shapes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  drawing_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  coordinates TEXT NOT NULL,
  properties TEXT,
  annotations TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (drawing_id) REFERENCES drawings (id) ON DELETE CASCADE
);
```

### API Endpoints
- `GET /api/drawings` - Get all drawings
- `GET /api/drawings/:id` - Get specific drawing with shapes
- `POST /api/drawings` - Create new drawing
- `PUT /api/drawings/:id` - Update drawing and shapes
- `DELETE /api/drawings/:id` - Delete drawing
- `GET /api/health` - Health check endpoint

## 🎯 Implementation Highlights

### Canvas Drawing System
- Custom HTML5 Canvas implementation
- Real-time shape preview during drawing
- Efficient rendering with shape caching
- Mouse event handling for all interactions

### Shape Management
- Object-oriented shape representation
- Coordinate-based positioning system
- Dynamic resize handle generation
- Collision detection for selection

### State Management
- React hooks for local state
- Centralized shape and drawing state
- Optimistic UI updates
- Error handling and recovery

## 🔧 Development

### Project Structure
```
building-planner/
├── building-planner-backend/
│   ├── server.js              # Express server
│   ├── package.json           # Backend dependencies
│   └── database.sqlite        # SQLite database
├── building-planner-frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API services
│   │   ├── test/              # Test files
│   │   └── BuildingPlanner.jsx # Main component
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
└── README.md                  # This file
```

### Code Quality
- ESLint configuration for code consistency
- Component-based architecture
- Separation of concerns
- Comprehensive error handling
- Responsive design principles

## 🚀 Deployment

### Environment Variables
Create `.env` files for different environments:

**Backend (.env)**
```
PORT=3001
NODE_ENV=production
```

**Frontend (.env)**
```
VITE_API_URL=http://your-backend-url/api
```

### Docker Support (Optional)
The application can be containerized using Docker for easy deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the excellent framework
- Vite team for the fast build tool
- Express.js community for the robust backend framework
- SQLite team for the reliable database engine

---

**Built with ❤️ for efficient building planning and design**
