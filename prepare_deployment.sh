#!/bin/bash

# Bonsai Prep Deployment Preparation Script
# This script prepares the application for deployment to a cPanel hosting environment

echo "=== Bonsai Prep Deployment Preparation Script ==="
echo "This script will build the application and create a deployment package."

# Ensure we're in the bonsai-prep directory
cd "$(dirname "$0")"

# Create deployment directory if it doesn't exist
DEPLOY_DIR="./deployment"
mkdir -p $DEPLOY_DIR

# Create a production .env file for the backend
echo "Creating backend .env.production file..."
cat > ./backend/.env.production << EOL
NODE_ENV=production
PORT=5000
DB_HOST=localhost
DB_USER=bonsaiprep_user
DB_PASSWORD=YOUR_PASSWORD_HERE
DB_NAME=bonsaiprep_db
DB_PORT=3306
JWT_SECRET=YOUR_JWT_SECRET_HERE
CORS_ORIGIN=https://app.bonsaiprep.com
EOL

echo "Please edit ./backend/.env.production with your actual database credentials."

# Build the frontend
echo "Building frontend..."
cd frontend
npm ci
npm run build
[ $? -ne 0 ] && { echo "Frontend build failed"; exit 1; }
cd ..

# Build the backend
echo "Building backend..."
cd backend
npm ci
npm run build
[ $? -ne 0 ] && { echo "Backend build failed"; exit 1; }
cd ..

# Create the deployment package
echo "Creating deployment package..."

# Copy frontend build to deployment directory
mkdir -p $DEPLOY_DIR/frontend
cp -r frontend/build/* $DEPLOY_DIR/frontend/
cp frontend/public/.htaccess $DEPLOY_DIR/frontend/

# Create the backend directory in the deployment package
mkdir -p $DEPLOY_DIR/backend
cp -r backend/dist $DEPLOY_DIR/backend/
cp backend/package.json $DEPLOY_DIR/backend/
cp backend/package-lock.json $DEPLOY_DIR/backend/
cp backend/.env.production $DEPLOY_DIR/backend/.env

# Copy the MySQL schema
cp schema.sql $DEPLOY_DIR/

# Create a deployment README
cat > $DEPLOY_DIR/README.md << EOL
# Bonsai Prep Deployment Package

This package contains the necessary files to deploy Bonsai Prep to your cPanel hosting.

## Contents

- **frontend/**: Static files for the React frontend (place in your document root)
- **backend/**: Node.js backend files (place outside your document root)
- **schema.sql**: MySQL database schema (import via phpMyAdmin)

## Deployment Steps

1. **Set Up Your MySQL Database**:
   - Create a database named \`bonsaiprep_db\` (or your preferred name)
   - Create a database user with all privileges on this database
   - Import \`schema.sql\` using phpMyAdmin

2. **Deploy the Frontend**:
   - Upload all files from the \`frontend\` folder to your subdomain's document root
   - Ensure the .htaccess file is properly uploaded

3. **Deploy the Backend**:
   - Create a directory outside your public_html (e.g., \`bonsai-backend_prod\`)
   - Upload all files from the \`backend\` folder to this directory
   - Set up a Node.js app in cPanel pointing to this directory
   - Set environment variables in the Node.js app setup
   - Start the Node.js application

4. **Configure Reverse Proxy**:
   - Add reverse proxy rules for API requests (usually handled by cPanel's Node.js setup)

For detailed instructions, please see the full deployment guide.
EOL

# Create an API proxy config for the subdomain root
cat > $DEPLOY_DIR/frontend/.htaccess.proxy << EOL
# This is an additional .htaccess configuration for proxying API requests
# You may need to merge this with the main .htaccess or use it if you're
# hosting frontend and backend on the same domain/subdomain

<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Proxy API requests to the Node.js backend
  RewriteCond %{REQUEST_URI} ^/api/(.*)$ [NC]
  RewriteRule ^api/(.*)$ http://localhost:5000/api/$1 [P,L]
  
  # Regular React routing rules (same as in main .htaccess)
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>
EOL

# Create a ZIP archive
echo "Creating ZIP archive..."
cd $DEPLOY_DIR
zip -r ../bonsai_deployment.zip .
cd ..

echo "Deployment package created: bonsai_deployment.zip"
echo "Upload this file to your cPanel and follow the instructions in the README."
echo ""
echo "Done!" 