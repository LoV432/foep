#!/bin/sh
set -e

# Run Drizzle migrations
echo "Running Drizzle migrations..."
npx drizzle-kit migrate:deploy

# Start the Node.js app
echo "Starting the Node.js app..."
exec "$@"