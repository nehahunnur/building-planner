# Building Planner Backend API

RESTful API server for the Building Planner application, providing data persistence and management for drawings and shapes.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## 📋 API Endpoints

### Health Check
- **GET** `/api/health`
  - Returns server status and timestamp
  - Response: `{ "status": "OK", "timestamp": "2025-06-23T14:00:00.000Z" }`

### Drawings Management

#### Get All Drawings
- **GET** `/api/drawings`
  - Returns array of all drawings ordered by update date
  - Response: Array of drawing objects

#### Get Specific Drawing
- **GET** `/api/drawings/:id`
  - Returns drawing with all associated shapes
  - Response: Drawing object with shapes array

#### Create New Drawing
- **POST** `/api/drawings`
  - Body: `{ "name": "Drawing Name", "description": "Optional description" }`
  - Response: Created drawing object

#### Update Drawing
- **PUT** `/api/drawings/:id`
  - Body: `{ "name": "Updated Name", "description": "Description", "shapes": [...] }`
  - Updates drawing metadata and replaces all shapes
  - Response: Success message

#### Delete Drawing
- **DELETE** `/api/drawings/:id`
  - Removes drawing and all associated shapes
  - Response: Success message

## 🗄️ Database Schema

### Tables

#### drawings
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PRIMARY KEY | Auto-incrementing ID |
| name | TEXT NOT NULL | Drawing name |
| description | TEXT | Optional description |
| created_at | DATETIME | Creation timestamp |
| updated_at | DATETIME | Last update timestamp |

#### shapes
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PRIMARY KEY | Auto-incrementing ID |
| drawing_id | INTEGER | Foreign key to drawings table |
| type | TEXT | Shape type (line, rectangle, circle, etc.) |
| coordinates | TEXT | JSON string of shape coordinates |
| properties | TEXT | JSON string of shape properties |
| annotations | TEXT | JSON string of annotation data |
| created_at | DATETIME | Creation timestamp |

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

### Dependencies
- **express** - Web framework
- **sqlite3** - Database driver
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Dependencies
- **nodemon** - Development server with auto-restart

## 📊 Data Models

### Drawing Object
```json
{
  "id": 1,
  "name": "Floor Plan",
  "description": "Main floor layout",
  "created_at": "2025-06-23T10:00:00Z",
  "updated_at": "2025-06-23T14:00:00Z",
  "shapes": [...]
}
```

### Shape Object
```json
{
  "id": 1,
  "drawing_id": 1,
  "type": "rectangle",
  "coordinates": {
    "startX": 10,
    "startY": 10,
    "endX": 100,
    "endY": 50
  },
  "properties": {},
  "annotations": {},
  "created_at": "2025-06-23T10:00:00Z"
}
```

## 🛡️ Error Handling

The API returns appropriate HTTP status codes:
- **200** - Success
- **400** - Bad Request (missing required fields)
- **404** - Not Found (drawing doesn't exist)
- **500** - Internal Server Error

Error responses include descriptive messages:
```json
{
  "error": "Drawing not found"
}
```

## 🔒 Security Considerations

- CORS enabled for cross-origin requests
- Input validation for required fields
- SQL injection prevention through parameterized queries
- Graceful error handling without exposing internal details

## 📈 Performance

- SQLite database for fast local storage
- Efficient queries with proper indexing
- JSON serialization for complex data structures
- Connection pooling for concurrent requests

## 🧪 Testing

API endpoints can be tested using tools like:
- **curl** - Command line testing
- **Postman** - GUI testing tool
- **Thunder Client** - VS Code extension

Example curl commands:
```bash
# Get all drawings
curl http://localhost:3001/api/drawings

# Create new drawing
curl -X POST http://localhost:3001/api/drawings \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Drawing", "description": "Test"}'

# Health check
curl http://localhost:3001/api/health
```

## 🚀 Deployment

### Production Setup
1. Set environment variables
2. Install production dependencies: `npm install --production`
3. Start server: `npm start`
4. Ensure SQLite database permissions are correct

### Database Backup
The SQLite database file (`database.sqlite`) should be backed up regularly in production environments.

## 📝 Logging

The server logs:
- Server startup information
- Database connection status
- Request errors
- Graceful shutdown events

## 🔄 Database Migrations

The database tables are created automatically on first run. For schema changes:
1. Update table creation SQL in `server.js`
2. Handle data migration if needed
3. Test with sample data

## 🤝 API Usage Examples

### JavaScript/Axios
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Get all drawings
const drawings = await axios.get(`${API_URL}/drawings`);

// Create new drawing
const newDrawing = await axios.post(`${API_URL}/drawings`, {
  name: 'My Drawing',
  description: 'A new building plan'
});

// Update drawing with shapes
await axios.put(`${API_URL}/drawings/${id}`, {
  name: 'Updated Drawing',
  shapes: [
    {
      type: 'rectangle',
      coordinates: { startX: 0, startY: 0, endX: 100, endY: 50 }
    }
  ]
});
```

## 📋 Maintenance

### Regular Tasks
- Monitor database size
- Check server logs for errors
- Backup database file
- Update dependencies for security patches

### Troubleshooting
- Check server logs for error details
- Verify database file permissions
- Ensure port 3001 is available
- Validate JSON request bodies
