#!/bin/sh
set -e

# Run Drizzle migrations
echo "Running Drizzle migrations..."
# This is obviously not the best way to do this but I can't figure out how to get migration to work with docker
cd /app && npm i drizzle-orm
cd /app && npx drizzle-kit migrate

# Start the Node.js app
echo "Starting the Node.js app..."
exec "$@"