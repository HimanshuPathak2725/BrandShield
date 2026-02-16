#!/bin/bash

# Build script for Vercel deployment
# Builds the React frontend

echo "Building BrandShield Frontend..."
cd frontend && npm install && npm run build
echo "Frontend build complete!"
