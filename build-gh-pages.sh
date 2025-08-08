#!/bin/bash
# Build script for GitHub Pages deployment

echo "Building for GitHub Pages..."

# Build the application
npm run build

# Copy additional files to dist
cp public/.nojekyll dist/
cp public/404.html dist/

echo "Build complete!"
echo "Files in dist:"
ls -la dist/

echo "Files in dist/assets:"
ls -la dist/assets/ | head -10
