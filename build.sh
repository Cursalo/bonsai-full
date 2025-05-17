#!/bin/bash
echo "Current directory:"
pwd
echo "Directory contents:"
ls -la
echo "Frontend directory contents:"
ls -la frontend || echo "Frontend directory not found"
echo "Backend directory contents:"
ls -la backend || echo "Backend directory not found"
echo "Installing and building frontend..."
cd frontend && npm install && npm run build
echo "Frontend build completed"
cd ..
echo "Installing and building backend..."
cd backend && npm install && npm run build
echo "Backend build completed"
echo "All builds completed"
