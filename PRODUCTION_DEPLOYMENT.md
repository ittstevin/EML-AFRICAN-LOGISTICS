# EML AFRICAN LOGISTICS - Production Deployment Guide

## Overview
This guide explains how to deploy the EML AFRICAN LOGISTICS system with:
- **Frontend**: Vercel (automatic deployment from GitHub)
- **Backend**: Your own server or cloud provider (Heroku, Railway, AWS, etc.)

---

## Part 1: Backend Deployment Setup

### Step 1: Choose Your Backend Host
Options:
- **Heroku** (free tier available, paid plans start at $7/month)
- **Railway** (pay-as-you-go, ~$5/month)
- **AWS** (free tier, then pay-per-use)
- **DigitalOcean** (App Platform, $12/month)
- **Your own VPS** (Linode, Vultr, etc.)

### Step 2: Prepare Backend for Production

#### 2.1 Update Environment Variables

Create `.env.production` in `backend/` directory:

```env
# Database
DATABASE_URL="file:./prod.db"

# JWT
JWT_SECRET="your-very-secure-random-secret-here"

# Server
PORT=5000
NODE_ENV="production"

# CORS
CORS_ORIGIN="https://your-vercel-frontend-url.vercel.app"
```

#### 2.2 Update package.json scripts (backend)

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "build": "npm install",
  "seed": "node prisma/seed.js"
}
```

#### 2.3 Database Migration for Production

**For SQLite (file-based - suitable for smaller deployments):**
Database file will be created automatically on first run.

**For PostgreSQL (recommended for production):**

1. Create PostgreSQL database on your provider
2. Update DATABASE_URL in .env.production
3. Run: `npx prisma migrate deploy`

### Step 3: Deploy Backend

**Example: Deploying to Railway**

1. Connect your GitHub repo to Railway
2. Add environment variables in Railway dashboard
3. Set start command: `npm run seed && npm start`
4. Deploy and get your backend URL (e.g., `https://your-app.up.railway.app`)

**Example: Deploying to Heroku**

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create eml-african-logistics-api

# Set environment variables
heroku config:set DATABASE_URL="postgresql://..." JWT_SECRET="your-secret"

# Deploy
git push heroku main

# Run seed
heroku run npm run seed
```

---

## Part 2: Frontend Deployment to Vercel

### Step 1: Deploy Frontend

1. Push code to GitHub (already done)
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repo: `https://github.com/ittstevin/EML-AFRICAN-LOGISTICS`
5. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 2: Set Environment Variables in Vercel

In Vercel project settings → Environment Variables:

```
VITE_API_BASE_URL=https://your-backend-url.com/api
```

(Replace with your actual backend URL from Step 1)

### Step 3: Deploy

Click "Deploy" - Vercel will automatically build and deploy!

Your frontend will be available at: `https://your-project.vercel.app`

---

## Part 3: Testing Production Deployment

### 1. Test Backend API

```bash
# Health check
curl https://your-backend-url/health

# Expected response:
# {"status":"OK","message":"EML AFRICAN LOGISTICS API is running"}
```

### 2. Test Frontend Connection

1. Open frontend URL in browser
2. Login with credentials: 
   - Email: `tevingichoya@gmail.com`
   - Password: `Tadmin@008`
3. Verify all pages load and API calls work

---

## Part 4: Database Management

### Backup Database

**SQLite:**
```bash
# Download prod.db file from your server
scp user@server:/path/to/backend/prod.db ./backup-$(date +%Y%m%d).db
```

**PostgreSQL:**
```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### Seed Initial Data

Production database has only one admin account:
- Email: `tevingichoya@gmail.com`
- Password: `Tadmin@008`

Create additional users via the registration page.

---

## Part 5: Scaling Considerations

### Frontend (Vercel)
- Automatically scales
- CDN available in 300+ cities
- No configuration needed

### Backend - Single Server
Works well for:
- Up to ~100 concurrent users
- < 1 million requests/day
- Non-critical systems

### Backend - Scale Up Options

**If traffic increases:**

1. **Use PostgreSQL instead of SQLite**
   - Better concurrent access
   - Can scale horizontally

2. **Add database backups**
   - Automated backups on your host
   - Regular export snapshots

3. **Use Redis for caching**
   - Speeds up API responses
   - Reduces database load

4. **Load balancer**
   - Run multiple backend instances
   - Distribute requests across them

5. **CDN for static assets**
   - Already handled by Vercel for frontend
   - Consider for any file uploads

---

## Part 6: Monitoring & Maintenance

### Monitor Backend

1. **Logs**: Check your hosting provider's logs dashboard
2. **Uptime**: Use [uptime.com](https://uptime.com) or similar
3. **Performance**: Monitor response times and errors

### Update & Patches

```bash
# Backend updates
cd backend
git pull origin main
npm install
npm run prisma:migrate  # If schema changed
npm start

# Frontend auto-deploys on push to GitHub
```

### Security

1. **Keep dependencies updated**
   ```bash
   npm audit fix
   ```

2. **Use strong JWT_SECRET**
   Generate with: `openssl rand -base64 32`

3. **Enable HTTPS**
   - Vercel: Automatic
   - Backend: Use reverse proxy (nginx) or host provider SSL

4. **Regular backups**
   - Backup database weekly
   - Backup uploaded files (if any)

---

## Part 7: Cost Breakdown

### Estimated Monthly Costs

| Service | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| Vercel | ✓ | $20+/mo | Frontend hosting, automatic deploys |
| Railway/Heroku | Limited | $7-50/mo | Backend hosting |
| PostgreSQL Database | - | $9-100/mo | Optional, instead of SQLite |
| **Total** | $0 | **$16-170/mo** | Depends on traffic & database |

### Cost Saving Tips
- Use SQLite for small-medium deployments (free)
- Monitor usage and upgrade only when needed
- Use shared database instances
- Implement caching (Redis) to reduce requests

---

## Part 8: Quick Reference - Commands

```bash
# Backend
npm install                    # Install dependencies
npm run dev                   # Start dev server
npm run prisma:seed          # Seed database
npm run build                # Build for production
npm start                    # Start production server

# Frontend  
npm install
npm run dev                  # Start dev server at :3000
npm run build                # Build for production
```

---

## Troubleshooting

### Backend won't start
- Check DATABASE_URL is correct
- Verify JWT_SECRET is set
- Check port 5000 is available
- Review logs for specific errors

### Frontend can't reach backend
- Verify VITE_API_BASE_URL in Vercel env vars
- Check backend CORS_ORIGIN matches frontend URL
- Ensure backend is running and accessible

### Database locked errors
- Stop backend server
- Delete `.db` files
- Restart backend to recreate
- Run seed again

---

## Next Steps

1. ✅ Deploy backend to your chosen host
2. ✅ Set environment variables
3. ✅ Deploy frontend to Vercel
4. ✅ Test all functionality
5. ✅ Set up monitoring and alerts
6. ✅ Configure automated backups
7. ✅ Document any custom changes

---

For support or questions:
- GitHub Issues: [EML-AFRICAN-LOGISTICS](https://github.com/ittstevin/EML-AFRICAN-LOGISTICS/issues)
- Backend API Docs: `https://your-backend-url/docs` (if Swagger added)
