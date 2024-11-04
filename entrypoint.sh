#!/bin/sh
set -e

# Run Drizzle migrations
echo "Running Drizzle migrations..."
# This is obviously not the best way to do this but I can't figure out how to get migration to work with docker
cd /migrations
npm install
npx drizzle-kit migrate

# Start the Node.js app
cd /app
echo "Starting the Node.js app..."
exec "$@"