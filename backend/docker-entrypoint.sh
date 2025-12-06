#!/bin/sh
set -e

echo "🚀 Starting Laravel application..."

# Create .env from environment variables
cat > /var/www/html/.env << EOF
APP_NAME=Laravel
APP_ENV=production
APP_KEY=${APP_KEY}
APP_DEBUG=false

DB_CONNECTION=${DB_CONNECTION}
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_DATABASE=${DB_DATABASE}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}

CACHE_STORE=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
EOF

echo "📋 Environment file created"

# Wait for database
echo "⏳ Waiting for database..."
MAX_ATTEMPTS=30
ATTEMPT=0

until php artisan db:show 2>/dev/null || [ $ATTEMPT -eq $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT+1))
    echo "Database not ready (attempt $ATTEMPT/$MAX_ATTEMPTS), waiting..."
    sleep 2
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo "❌ Could not connect to database after $MAX_ATTEMPTS attempts"
    exit 1
fi

echo "✅ Database is ready!"

# Run migrations
echo "🔄 Running migrations..."
# Apply any pending migrations (safe to run repeatedly)
php artisan migrate --force


# Storage link
echo "🔗 Creating storage link..."
php artisan storage:link || true

# Cache configuration
echo "⚡ Caching configuration..."
php artisan config:cache
php artisan route:cache

echo "✨ Laravel is ready!"

# Start PHP-FPM
exec php-fpm