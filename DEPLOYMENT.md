# Deployment Guide

This guide covers various deployment options for the Freelance Project Tracker application.

## 🚀 Quick Deployment Options

### 1. Docker Deployment (Recommended)

#### Prerequisites
- Docker and Docker Compose installed
- Git repository cloned

#### Steps
```bash
# Clone the repository
git clone <your-repo-url>
cd freelance-project-tracker

# Create environment file
cp .env.example .env
# Edit .env with your production values

# Build and start services
docker-compose up --build -d

# Access the application
# App: http://localhost:3000
# MongoDB Express: http://localhost:8081
```

### 2. Vercel Deployment

#### Prerequisites
- Vercel account
- MongoDB Atlas database

#### Steps
1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   MONGODB_URI=mongodb+srv://...
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### 3. Netlify Deployment

#### Prerequisites
- Netlify account
- MongoDB Atlas database

#### Steps
1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://...
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-app.netlify.app
   NODE_ENV=production
   ```

### 4. Railway Deployment

#### Prerequisites
- Railway account
- GitHub repository

#### Steps
1. **Connect Repository**
   - Link your GitHub repository to Railway
   - Railway will auto-detect Next.js

2. **Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://...
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-app.railway.app
   NODE_ENV=production
   PORT=3000
   ```

3. **Deploy**
   - Push to main branch triggers automatic deployment

## 🔧 Environment Configuration

### Required Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/freelance-tracker

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# App Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Optional Environment Variables
```env
# Email (for notifications)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Analytics
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

## 🗄️ Database Setup

### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create new cluster
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string

### Local MongoDB
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Using MongoDB Community Edition
# Follow installation guide for your OS
```

## 🔒 Security Checklist

- [ ] Strong NEXTAUTH_SECRET (32+ characters)
- [ ] Secure MongoDB connection (Atlas or secured local)
- [ ] Environment variables not committed to git
- [ ] HTTPS enabled in production
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] SQL injection protection (using Mongoose)

## 📊 Performance Optimization

### Next.js Optimizations
- ✅ Static generation where possible
- ✅ Image optimization enabled
- ✅ Bundle analysis
- ✅ Code splitting

### Database Optimizations
- [ ] Database indexing
- [ ] Connection pooling
- [ ] Query optimization
- [ ] Caching strategy

## 🔍 Monitoring & Logging

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Vercel Analytics
- **Performance**: Vercel Speed Insights
- **Uptime**: UptimeRobot

### Health Check Endpoint
Create `/api/health` for monitoring:
```javascript
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Clear `.next` folder
   - Verify all dependencies installed

2. **Database Connection**
   - Verify MONGODB_URI format
   - Check network connectivity
   - Ensure database user permissions

3. **Authentication Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches domain
   - Ensure cookies are enabled

4. **Docker Issues**
   - Check Docker daemon running
   - Verify port availability
   - Check container logs: `docker-compose logs`

### Debug Commands
```bash
# Check application logs
docker-compose logs app

# Check database logs
docker-compose logs mongo

# Restart services
docker-compose restart

# Rebuild containers
docker-compose up --build --force-recreate
```

## 📞 Support

For deployment issues:
1. Check this guide first
2. Review application logs
3. Check GitHub issues
4. Create new issue with:
   - Deployment platform
   - Error messages
   - Environment details

---

**Happy Deploying! 🚀**