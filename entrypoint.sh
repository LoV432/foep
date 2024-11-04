#!/bin/sh
set -e

# Run Drizzle migrations
echo "Running Drizzle migrations..."
npm i -g drizzle-orm
npx drizzle-kit migrate

# Start the Node.js app
echo "Starting the Node.js app..."
exec "$@"