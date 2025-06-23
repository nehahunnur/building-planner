const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5177', 'http://localhost:5178'],
  credentials: true
}));
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // Drawings table
  db.run(`
    CREATE TABLE IF NOT EXISTS drawings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Shapes table
  db.run(`
    CREATE TABLE IF NOT EXISTS shapes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      drawing_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      coordinates TEXT NOT NULL,
      properties TEXT,
      annotations TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (drawing_id) REFERENCES drawings (id) ON DELETE CASCADE
    )
  `);
});

// Routes

// Get all drawings
app.get('/api/drawings', (req, res) => {
  db.all('SELECT * FROM drawings ORDER BY updated_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get a specific drawing with its shapes
app.get('/api/drawings/:id', (req, res) => {
  const drawingId = req.params.id;
  
  db.get('SELECT * FROM drawings WHERE id = ?', [drawingId], (err, drawing) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!drawing) {
      res.status(404).json({ error: 'Drawing not found' });
      return;
    }

    db.all('SELECT * FROM shapes WHERE drawing_id = ?', [drawingId], (err, shapes) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // Parse JSON strings back to objects
      const parsedShapes = shapes.map(shape => ({
        ...shape,
        coordinates: JSON.parse(shape.coordinates),
        properties: shape.properties ? JSON.parse(shape.properties) : {},
        annotations: shape.annotations ? JSON.parse(shape.annotations) : {}
      }));

      res.json({
        ...drawing,
        shapes: parsedShapes
      });
    });
  });
});

// Create a new drawing
app.post('/api/drawings', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    res.status(400).json({ error: 'Drawing name is required' });
    return;
  }

  db.run(
    'INSERT INTO drawings (name, description) VALUES (?, ?)',
    [name, description || ''],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        name,
        description: description || '',
        shapes: []
      });
    }
  );
});

// Update a drawing
app.put('/api/drawings/:id', (req, res) => {
  const { name, description, shapes } = req.body;
  const drawingId = req.params.id;

  db.run(
    'UPDATE drawings SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, description || '', drawingId],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (shapes) {
        // Delete existing shapes
        db.run('DELETE FROM shapes WHERE drawing_id = ?', [drawingId], (err) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }

          // Insert new shapes
          const stmt = db.prepare(`
            INSERT INTO shapes (drawing_id, type, coordinates, properties, annotations)
            VALUES (?, ?, ?, ?, ?)
          `);

          shapes.forEach(shape => {
            stmt.run([
              drawingId,
              shape.type,
              JSON.stringify(shape.coordinates),
              JSON.stringify(shape.properties || {}),
              JSON.stringify(shape.annotations || {})
            ]);
          });

          stmt.finalize();
          res.json({ message: 'Drawing updated successfully' });
        });
      } else {
        res.json({ message: 'Drawing updated successfully' });
      }
    }
  );
});

// Delete a drawing
app.delete('/api/drawings/:id', (req, res) => {
  const drawingId = req.params.id;
  
  db.run('DELETE FROM drawings WHERE id = ?', [drawingId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Drawing deleted successfully' });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Building Planner API server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});
