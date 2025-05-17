# Bonsai Reborn Vercel + Supabase Deployment Guide

This guide outlines the steps to deploy the Bonsai Reborn application using Vercel for hosting and Supabase for the database.

## Prerequisites

- [Vercel account](https://vercel.com/signup)
- [Supabase account](https://supabase.com/dashboard/sign-up)
- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/)

## 1. Supabase Setup

### Create a Supabase Project

1. Log in to your Supabase account
2. Create a new project
3. Note your Supabase URL and API keys (anon key and service role key)

### Apply Database Schema

Use our prepared script to apply the schema:

```bash
cd bonsai-prep
node apply-schema.js
```

Alternatively, you can manually copy and execute the SQL from `supabase-schema.sql` in the Supabase SQL Editor.

## 2. Environment Variables Setup

### Frontend Environment Variables

In Vercel, set the following environment variables for the frontend project:

- `REACT_APP_SUPABASE_URL`: https://tzekravlcxjpfeetbsfr.supabase.co
- `REACT_APP_SUPABASE_ANON_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZWtyYXZsY3hqcGZlZXRic2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MDE1NjIsImV4cCI6MjA2MTA3NzU2Mn0.t1gqnRPUqXQpK62v0dA8Iqu7y8Lm0u_5VWBWHzdeKKY
- `REACT_APP_API_URL`: https://bonsai-reborn-api.vercel.app (or your backend API URL)

### Backend Environment Variables

In Vercel, set the following environment variables for the backend project:

- `SUPABASE_URL`: https://tzekravlcxjpfeetbsfr.supabase.co
- `SUPABASE_SERVICE_ROLE_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6ZWtyYXZsY3hqcGZlZXRic2ZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTUwMTU2MiwiZXhwIjoyMDYxMDc3NTYyfQ.UHbcYbnlcqVMNjVTUxaMlH9xRGDmxXZEotG7v5Kw-Dw
- `PORT`: 8000
- `FRONTEND_URL`: https://bonsai-reborn.vercel.app (or your frontend URL)
- `JWT_SECRET`: Create a secure random string
- `NODE_ENV`: production

## 3. Git Repository Setup

### Initialize Git Repositories

For the frontend:

```bash
cd bonsai-prep/frontend
git init
git add .
git commit -m "Initial commit"
```

For the backend:

```bash
cd bonsai-prep/backend
git init
git add .
git commit -m "Initial commit"
```

## 4. Vercel Deployment

### Deploy Frontend

1. From the Vercel dashboard, click "Add New" > "Project"
2. Import your frontend Git repository
3. Configure project settings:
   - Framework Preset: Create React App
   - Build Command: npm run build
   - Output Directory: build
4. Add the environment variables mentioned above
5. Click "Deploy"

### Deploy Backend

1. From the Vercel dashboard, click "Add New" > "Project"
2. Import your backend Git repository
3. Configure project settings:
   - Framework Preset: Other
   - Build Command: npm install
   - Output Directory: (leave blank)
   - Install Command: npm install
4. Add the environment variables mentioned above
5. Click "Deploy"

## 5. Verify Deployment

1. Test the frontend application at your Vercel URL
2. Test API endpoints using your backend Vercel URL
3. Check for any errors in the Vercel deployment logs

## Troubleshooting

- **CORS Issues**: Ensure your backend has CORS configured to allow requests from your frontend domain
- **Database Connection Issues**: Verify environment variables are correctly set and database is accessible
- **Deployment Failed**: Check Vercel logs for specific errors

## Security Notes

- Never commit `.env` files or sensitive keys to your repository
- Use environment variables in Vercel for all sensitive information
- Consider rotating your Supabase keys periodically

## Maintenance

- Update your application by pushing new commits to your repository
- Vercel will automatically redeploy on push
- Monitor your Supabase usage and upgrade your plan if necessary 