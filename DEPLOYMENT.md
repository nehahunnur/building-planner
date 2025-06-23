# Building Planner - Deployment Guide

This guide covers deployment options for the Building Planner application in various environments.

## 🚀 Quick Deployment

### Development Environment
```bash
# Clone and setup
git clone https://github.com/yourusername/building-planner.git
cd building-planner
npm run install:all

# Start both servers
npm run dev
```

Access the application at:
- Frontend: http://localhost:5177
- Backend API: http://localhost:3001

## 🌐 Production Deployment

### Option 1: Traditional Hosting

#### Backend Deployment (Node.js Hosting)
```bash
# On your server
git clone https://github.com/yourusername/building-planner.git
cd building-planner/building-planner-backend

# Install production dependencies
npm install --production

# Set environment variables
export PORT=3001
export NODE_ENV=production

# Start with PM2 (recommended)
npm install -g pm2
pm2 start server.js --name "building-planner-api"
pm2 startup
pm2 save
```

#### Frontend Deployment (Static Hosting)
```bash
# Build for production
cd building-planner-frontend
npm run build

# Deploy dist/ folder to your static host
# (Netlify, Vercel, GitHub Pages, etc.)
```

### Option 2: Docker Deployment

#### Backend Dockerfile
```dockerfile
# building-planner-backend/Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production

COPY . .
EXPOSE 3001

CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
# building-planner-frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./building-planner-backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    volumes:
      - ./data:/app/data

  frontend:
    build: ./building-planner-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

### Option 3: Cloud Platform Deployment

#### Heroku Deployment
```bash
# Backend
cd building-planner-backend
heroku create your-app-name-api
git push heroku main

# Frontend (Netlify)
cd building-planner-frontend
npm run build
# Deploy dist/ folder to Netlify
```

#### Vercel Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy frontend
cd building-planner-frontend
vercel --prod

# Deploy backend
cd building-planner-backend
vercel --prod
```

## ⚙️ Environment Configuration

### Backend Environment Variables
```bash
# .env
PORT=3001
NODE_ENV=production
DATABASE_PATH=./database.sqlite
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend Environment Variables
```bash
# .env
VITE_API_URL=https://your-backend-domain.com/api
```

## 🗄️ Database Setup

### SQLite (Default)
- Database file is created automatically
- Ensure write permissions for the application
- Regular backups recommended

### PostgreSQL (Alternative)
```bash
# Install pg driver
npm install pg

# Update connection in server.js
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
```

## 🔒 Security Configuration

### HTTPS Setup
```nginx
# nginx.conf
server {
    listen 443 ssl;
    server_name your-domain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### CORS Configuration
```javascript
// server.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5177',
  credentials: true
}));
```

## 📊 Monitoring & Logging

### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs building-planner-api

# Restart application
pm2 restart building-planner-api
```

### Health Checks
```bash
# Backend health check
curl https://your-api-domain.com/api/health

# Expected response
{"status":"OK","timestamp":"2025-06-23T14:00:00.000Z"}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy Building Planner

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd building-planner-frontend
          npm install
      
      - name: Run tests
        run: |
          cd building-planner-frontend
          npm test -- --run

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "your-app-name-api"
          heroku_email: "your-email@example.com"
          appdir: "building-planner-backend"

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Deploy to Netlify
        run: |
          cd building-planner-frontend
          npm install
          npm run build
          npx netlify-cli deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{secrets.NETLIFY_AUTH_TOKEN}}
          NETLIFY_SITE_ID: ${{secrets.NETLIFY_SITE_ID}}
```

## 🔧 Performance Optimization

### Frontend Optimizations
```bash
# Build with optimizations
npm run build

# Analyze bundle size
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/assets/*.js
```

### Backend Optimizations
```javascript
// server.js
const compression = require('compression');
app.use(compression());

// Enable gzip compression
app.use(express.static('public', {
  maxAge: '1y',
  etag: false
}));
```

## 📱 Mobile Deployment

### PWA Configuration
```json
// public/manifest.json
{
  "name": "Building Planner",
  "short_name": "BuildPlan",
  "description": "Professional building planning tool",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007bff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🚨 Troubleshooting

### Common Issues

#### CORS Errors
```javascript
// Ensure backend CORS is configured
app.use(cors({
  origin: ['http://localhost:5177', 'https://your-domain.com']
}));
```

#### Database Connection Issues
```bash
# Check file permissions
ls -la database.sqlite
chmod 664 database.sqlite

# Check disk space
df -h
```

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 16+
```

## 📋 Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backup created
- [ ] SSL certificates ready
- [ ] Domain DNS configured

### Post-deployment
- [ ] Health checks passing
- [ ] Frontend loads correctly
- [ ] API endpoints responding
- [ ] Database connections working
- [ ] Monitoring configured
- [ ] Backup strategy implemented

### Rollback Plan
```bash
# Quick rollback with PM2
pm2 restart building-planner-api --update-env

# Database rollback
cp database.sqlite.backup database.sqlite

# Frontend rollback
# Redeploy previous version from git tag
```

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review application logs
3. Verify environment configuration
4. Contact support with error details

---

**Note**: Always test deployments in a staging environment before production deployment.
