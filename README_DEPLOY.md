# Bonsai Prep Deployment Guide for cPanel

This guide provides step-by-step instructions for deploying the Bonsai Prep application to your cPanel hosting at app.bonsaiprep.com.

## Prerequisites

- cPanel hosting account with:
  - MySQL database support
  - Node.js support (through cPanel's "Setup Node.js App" feature)
  - SSH access (optional, but recommended)
- Domain with DNS configured for the app.bonsaiprep.com subdomain
- Git (for local development)

## Deployment Overview

The deployment consists of four main parts:
1. Preparing the application for deployment
2. Setting up the MySQL database
3. Deploying the frontend (React)
4. Deploying the backend (Node.js/Express)

## 1. Prepare Application for Deployment

**Option A: Using the automated script (requires SSH access to local repository)**

1. Navigate to the bonsai-prep directory
   ```
   cd path/to/bonsai-prep
   ```

2. Make the script executable
   ```
   chmod +x prepare_deployment.sh
   ```

3. Run the deployment script
   ```
   ./prepare_deployment.sh
   ```

4. The script will create a `bonsai_deployment.zip` file with all the necessary components.

**Option B: Manual preparation**

1. Build the frontend:
   ```
   cd bonsai-prep/frontend
   npm install
   npm run build
   ```

2. Build the backend:
   ```
   cd bonsai-prep/backend
   npm install
   npm run build
   ```

3. Create a deployment directory and copy the following:
   - Frontend build files (from `frontend/build/`)
   - `.htaccess` file (from `frontend/public/.htaccess`)
   - Backend build files (from `backend/dist/`)
   - Backend `package.json` and `package-lock.json`
   - Schema file (`schema.sql`)

4. Create a `.env` file for the backend with production settings.

## 2. Set Up MySQL Database in cPanel

1. Log in to your cPanel account.

2. Navigate to **MySQL Databases** in the Databases section.

3. Create a new database:
   - Enter a name (e.g., `bonsaiprep_db`)
   - Click **Create Database**

4. Create a new database user:
   - Enter a username (e.g., `bonsaiprep_user`)
   - Enter a strong password
   - Click **Create User**

5. Add the user to the database:
   - Select the user and database
   - Grant ALL PRIVILEGES
   - Click **Add**

6. Import the schema:
   - Click on **phpMyAdmin** in cPanel
   - Select your database from the left sidebar
   - Click on the **Import** tab
   - Choose the `schema.sql` file
   - Click **Go**

## 3. Deploy the Frontend

1. In cPanel, navigate to **File Manager**.

2. Navigate to the document root for your subdomain:
   - Usually `/home/username/public_html/app` or `/home/username/app.bonsaiprep.com`

3. Upload the contents of the `frontend` directory from your deployment package.

4. Ensure the `.htaccess` file is uploaded. If not, upload it separately.

5. Check permissions:
   - Files should be 644 (rw-r--r--)
   - Directories should be 755 (rwxr-xr-x)

## 4. Deploy the Backend

1. Create a directory for your backend **outside** the public_html directory:
   ```
   mkdir -p /home/username/bonsai-backend_prod
   ```

2. Upload the contents of the `backend` directory from your deployment package to this directory.

3. Configure Node.js in cPanel:

   a. Navigate to **Setup Node.js App** in cPanel.
   
   b. Click **Create Application**.
   
   c. Configure the application:
      - Application root: `/home/username/bonsai-backend_prod`
      - Application URL: Your subdomain or a path under it (follow cPanel's requirements)
      - Application startup file: `dist/index.js`
      - Node.js version: Select the appropriate version (14.x or higher)
      - Environment variables:
        ```
        NODE_ENV=production
        PORT=5000 (or as assigned by cPanel)
        DB_HOST=localhost
        DB_USER=bonsaiprep_user
        DB_PASSWORD=your_password
        DB_NAME=bonsaiprep_db
        DB_PORT=3306
        JWT_SECRET=your_secure_jwt_secret
        CORS_ORIGIN=https://app.bonsaiprep.com
        ```
      
   d. Click **Create**.
   
   e. Once created, click on **Run NPM Install** to install dependencies.
   
   f. Start the application by clicking **Run JS Script**.

## 5. Configure Reverse Proxy (if needed)

If your frontend and backend are on the same domain/subdomain (like app.bonsaiprep.com), you'll need to set up a reverse proxy to direct API requests to your Node.js application.

1. Check if the cPanel Node.js setup has created a proxy configuration for you.

2. If not, you may need to modify the `.htaccess` file in your frontend directory to include the proxy rules from the `.htaccess.proxy` file provided in the deployment package.

3. For a different subdomain setup (e.g., api.bonsaiprep.com for the backend), make sure to:
   - Update CORS settings in your backend
   - Update API endpoint URLs in your frontend

## 6. Test the Deployment

1. Visit your frontend URL (e.g., https://app.bonsaiprep.com)

2. Test API endpoints (e.g., https://app.bonsaiprep.com/api/reports)

3. Check browser console for any errors

## Troubleshooting

**Frontend Shows Blank Page:**
- Check browser console for errors
- Ensure all files were uploaded properly
- Verify the `.htaccess` file is correct and uploaded

**API Requests Failing:**
- Check if the Node.js application is running
- Verify proxy settings in `.htaccess`
- Check CORS settings
- Confirm database connection is working

**Database Connection Issues:**
- Verify credentials in the `.env` file
- Check database user privileges
- Test connection directly in phpMyAdmin

**Node.js Application Won't Start:**
- Check logs in the Node.js app interface
- Verify all dependencies are installed
- Check for syntax errors in your code

## Maintenance and Updates

For future updates:

1. Make changes in your development environment
2. Test thoroughly
3. Run the deployment preparation script again
4. Upload only the changed files to your cPanel server
5. Restart the Node.js application if backend changes were made

## Security Considerations

- Keep your `.env` file secure and never commit it to your repository
- Regularly update dependencies for security patches
- Set up regular database backups through cPanel
- Consider setting up SSL if not automatically configured

## Support

For further assistance, contact the Bonsai Prep development team. 