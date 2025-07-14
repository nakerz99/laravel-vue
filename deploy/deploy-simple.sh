#!/bin/bash

# Simple Nginx Deployment for Laravel + Vue.js Todo App
# For servers with existing PHP 8.3, npm, and basic setup

echo "🚀 Starting Nginx deployment for todolist subdomains"

# Variables
FRONTEND_DOMAIN="todolist.techportfolio.space"
BACKEND_DOMAIN="todolist-api.techportfolio.space"
APP_DIR="/var/www/laravel-vue"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

echo_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Configure MySQL (using existing installation)
echo "🔧 Configuring MySQL..."
MYSQL_ROOT_PASSWORD="Strong@091719"

# Create application database and user
DB_NAME="todo_production"
DB_USER="todo_user"
DB_PASSWORD="TodoUser@2025"

mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};" 2>/dev/null || echo "Database may already exist"
mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';" 2>/dev/null || echo "User may already exist"
mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "FLUSH PRIVILEGES;"

echo_success "MySQL configured"

# 2. Install Nginx if needed
echo "📦 Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt update
    sudo apt install nginx -y
fi
sudo systemctl enable nginx
sudo systemctl start nginx
echo_success "Nginx ready"

# 3. Install PHP-FPM if needed
echo "🔧 Installing PHP-FPM..."
sudo apt install php8.3-fpm -y
sudo systemctl enable php8.3-fpm
sudo systemctl start php8.3-fpm
echo_success "PHP-FPM ready"

# 4. Setup Nginx configurations
echo "📝 Setting up Nginx virtual hosts..."

# Copy configurations if they exist in /tmp
if [ -f "/tmp/todolist.techportfolio.space" ] && [ -f "/tmp/todolist-api.techportfolio.space" ]; then
    sudo cp /tmp/todolist.techportfolio.space /etc/nginx/sites-available/
    sudo cp /tmp/todolist-api.techportfolio.space /etc/nginx/sites-available/
    
    # Enable sites
    sudo ln -sf /etc/nginx/sites-available/todolist.techportfolio.space /etc/nginx/sites-enabled/
    sudo ln -sf /etc/nginx/sites-available/todolist-api.techportfolio.space /etc/nginx/sites-enabled/
    
    # Remove default site
    sudo rm -f /etc/nginx/sites-enabled/default
    
    echo_success "Nginx configurations applied"
else
    echo_error "Nginx configuration files not found in /tmp"
    echo "Please ensure todolist.techportfolio.space and todolist-api.techportfolio.space are uploaded to /tmp"
    exit 1
fi

# 5. Test Nginx configuration
echo "🔍 Testing Nginx configuration..."
if sudo nginx -t; then
    echo_success "Nginx configuration is valid"
    sudo systemctl reload nginx
else
    echo_error "Nginx configuration test failed"
    exit 1
fi

# 6. Set permissions
echo "📁 Setting permissions..."
sudo chown -R www-data:www-data ${APP_DIR}
sudo chmod -R 755 ${APP_DIR}
echo_success "Permissions set"

# 7. Install Composer if needed
if ! command -v composer &> /dev/null; then
    echo "📦 Installing Composer..."
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
    echo_success "Composer installed"
fi

# 8. Configure Laravel
echo "⚙️ Configuring Laravel..."
cd ${APP_DIR}/laravel-todo-api

# Install dependencies
sudo -u www-data composer install --optimize-autoloader --no-dev

# Copy environment file
if [ -f "/tmp/.env.production" ]; then
    sudo cp /tmp/.env.production .env
    sudo chown www-data:www-data .env
    echo_success "Environment file copied"
else
    echo_error ".env.production not found in /tmp"
    exit 1
fi

# Generate application key
sudo -u www-data php artisan key:generate

# Run migrations and seed
sudo -u www-data php artisan migrate --force
sudo -u www-data php artisan db:seed --class=TodoSeeder --force

# Cache for production
sudo -u www-data php artisan config:cache
sudo -u www-data php artisan route:cache
sudo -u www-data php artisan view:cache

# Set proper permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

echo_success "Laravel configured"

# 9. Build Vue.js frontend
echo "🎨 Building Vue.js frontend..."
cd ${APP_DIR}/vue-todo-app

# Copy production API configuration
if [ -f "/tmp/api.production.js" ]; then
    sudo cp /tmp/api.production.js src/services/api.js
    echo_success "API configuration updated"
else
    echo_error "api.production.js not found in /tmp"
    exit 1
fi

# Install dependencies and build
sudo -u www-data npm install
sudo -u www-data npm run build

echo_success "Vue.js frontend built"

# 10. Final status
echo ""
echo "🔒 Next Steps - SSL Certificate Setup:"
echo "Run these commands to get SSL certificates:"
echo "sudo certbot --nginx -d ${FRONTEND_DOMAIN}"
echo "sudo certbot --nginx -d ${BACKEND_DOMAIN}"
echo ""

echo_success "MySQL root password: ${MYSQL_ROOT_PASSWORD}"
echo_success "Database: ${DB_NAME}, User: ${DB_USER}, Password: ${DB_PASSWORD}"
echo ""

echo_success "Deployment completed!"
echo "🌐 Frontend: http://${FRONTEND_DOMAIN} (https after SSL)"
echo "🌐 Backend: http://${BACKEND_DOMAIN} (https after SSL)"
