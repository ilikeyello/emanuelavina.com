#!/bin/bash

# Memory-efficient development script
echo "Starting development server with memory optimizations..."

# Set Node.js memory limit (adjust based on your RAM)
export NODE_OPTIONS="--max-old-space-size=2048"

# Set Next.js development optimizations
export NEXT_TELEMETRY_DISABLED=1
export NODE_ENV=development

# Limit parallel builds
export NEXT_BUILD_WORKERS=1

echo "Environment configured:"
echo "- Node memory limit: 2GB"
echo "- Telemetry disabled"
echo "- Single worker for builds"
echo ""
echo "Starting Next.js dev server..."
echo "Visit: http://localhost:3000"
echo ""
echo "To stop: Press Ctrl+C"
echo ""

# Start with memory-efficient flags
npm run dev
