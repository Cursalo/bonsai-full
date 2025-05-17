#!/bin/bash
echo "Current directory:"
pwd
echo "Directory contents:"
ls -la
echo "Installing dependencies..."
npm install
echo "Building project..."
cd bonsai-prep/frontend && npm install && npm run build
cd ../../..
cd bonsai-prep/backend && npm install && npm run build
echo "Build completed"
