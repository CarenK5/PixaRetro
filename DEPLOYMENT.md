# PixaRetro Deployment Guide

## Setup Steps

### 1. Supabase Setup (Database)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your credentials:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`

4. **Run the database schema**:
   - Go to SQL Editor in Supabase
   - Copy and paste contents of `database/schema.sql`
   - Execute the script

### 2. Railway Deployment

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select `CarenK5/PixaRetro` repository
5. Add environment variables (from Supabase):
   ```
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_KEY=your_service_key_here
   NVIDIA_API_KEY=your_nvidia_key_here
   NODE_ENV=production
   ```

6. Railway will automatically detect `Procfile` and deploy

### 3. Enable Autodeployment

- Railway auto-deploys on every GitHub push to `main` branch
- Monitor deployments in Railway dashboard

## Database Schema

The schema includes:
- `users` - Clients and photographers
- `photographer_profiles` - Specialties, rates, availability
- `portfolio_items` - Images/videos
- `bookings` - Booking requests and management
- `payments` - Payment tracking
- `reviews` - Ratings and feedback
- `messages` - In-app messaging

## Environment Variables

See `.env.example` for all required variables.

## Free Tier Limits

**Supabase Free:**
- 500MB storage
- 2GB bandwidth
- Real-time updates
- Up to 50 concurrent connections

**Railway Free:**
- $5/month credit
- Enough for small projects
- Perfect for MVP

## Next Steps

1. Update frontend to call `/api` endpoints with Supabase data
2. Set up authentication with Supabase Auth
3. Add image upload to Supabase Storage
4. Monitor usage in Railway/Supabase dashboards

## Monitoring

- **Railway**: https://railway.app/dashboard
- **Supabase**: https://app.supabase.com
- **Logs**: Check Railway & Supabase dashboards for errors
