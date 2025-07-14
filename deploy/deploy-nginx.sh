#!/bin/bash

# Nginx Deployment Script for Laravel + Vue.js Todo App
# Run this script on your Ubuntu server as root or with sudo

echo "🚀 Starting Nginx deployment for todolist.techportfolio.space"

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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo_warning "Running as root. Make sure this is intended."
fi

# 0. Install required packages
echo "📦 Installing required packages..."
sudo apt update
sudo apt install -y nginx mysql-server php8.3-fpm php8.3-mysql php8.3-xml php8.3-mbstring php8.3-curl php8.3-zip php8.3-bcmath php8.3-gd certbot python3-certbot-nginx

echo_success "Required packages installed"

# 1. Install and configure MySQL
echo "🗄️ Installing and configuring MySQL..."

# Secure MySQL installation with predefined root password
MYSQL_ROOT_PASSWORD="Strong@091719"
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}';"
sudo mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "DELETE FROM mysql.user WHERE User='';"
sudo mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
sudo mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "DROP DATABASE IF EXISTS test;"
sudo mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';"
sudo mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "FLUSH PRIVILEGES;"

# Create application database and user
DB_NAME="todo_production"
DB_USER="todo_user"
DB_PASSWORD="TodoUser@2025"

sudo mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
sudo mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';"
sudo mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
sudo mysql -u root -p${MYSQL_ROOT_PASSWORD} -e "FLUSH PRIVILEGES;"

echo_success "MySQL installed and configured"

# 2. Set permissions for application directory
echo "📁 Setting permissions for application directory..."
sudo chown -R www-data:www-data $APP_DIR
sudo chmod -R 755 $APP_DIR
echo_success "Permissions set for application directory at $APP_DIR"

# 3. Configure PHP-FPM
echo "🔧 Configuring PHP-FPM..."
sudo systemctl enable php8.3-fpm
sudo systemctl start php8.3-fpm
echo_success "PHP-FPM configured and started"

# 4. Setup Nginx configurations
echo "📝 Setting up Nginx virtual hosts..."

# Check if nginx config files exist
if [ ! -f "./${FRONTEND_DOMAIN}" ] || [ ! -f "./${BACKEND_DOMAIN}" ]; then
    echo_error "Nginx configuration files not found. Please ensure ${FRONTEND_DOMAIN} and ${BACKEND_DOMAIN} are in the current directory"
    exit 1
fi

# Copy Nginx configurations
sudo cp ./${FRONTEND_DOMAIN} /etc/nginx/sites-available/${FRONTEND_DOMAIN}
sudo cp ./${BACKEND_DOMAIN} /etc/nginx/sites-available/${BACKEND_DOMAIN}

# Enable sites
sudo ln -sf /etc/nginx/sites-available/${FRONTEND_DOMAIN} /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/${BACKEND_DOMAIN} /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

echo_success "Nginx configurations copied and enabled"

# 5. Test Nginx configuration
echo "🔍 Testing Nginx configuration..."
if sudo nginx -t; then
    echo_success "Nginx configuration is valid"
else
    echo_error "Nginx configuration test failed"
    exit 1
fi

# 6. Start Nginx
echo "🌐 Starting Nginx..."
sudo systemctl enable nginx
sudo systemctl start nginx
echo_success "Nginx started and enabled"

# 7. Configure Laravel
echo "⚙️ Configuring Laravel..."
cd $APP_DIR/laravel-todo-api

# Install dependencies
sudo -u www-data composer install --optimize-autoloader --no-dev

# Copy environment file
sudo cp $APP_DIR/deploy/.env.production .env
sudo chown www-data:www-data .env

# Generate application key
sudo -u www-data php artisan key:generate

# Cache configuration for production
sudo -u www-data php artisan config:cache
sudo -u www-data php artisan route:cache
sudo -u www-data php artisan view:cache

# Run migrations and seed
sudo -u www-data php artisan migrate --force
sudo -u www-data php artisan db:seed --class=TodoSeeder --force

# Set proper permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

echo_success "Laravel configured"

# 8. Build Vue.js frontend
echo "🎨 Building Vue.js frontend..."
cd $APP_DIR/vue-todo-app

# Copy production API configuration
sudo cp $APP_DIR/deploy/api.production.js src/services/api.js

# Install dependencies and build
sudo -u www-data npm install
sudo -u www-data npm run build

echo_success "Vue.js frontend built"

# 9. SSL Certificate setup instructions
echo ""
echo "🔒 SSL Certificate Setup:"
echo_warning "Run the following commands to get SSL certificates:"
echo "sudo certbot --nginx -d $FRONTEND_DOMAIN"
echo "sudo certbot --nginx -d $BACKEND_DOMAIN"
echo ""

# 10. Final steps
echo "🎯 Final Steps:"
echo "1. Get SSL certificates (commands above)"
echo "2. Test your applications:"
echo "   - Frontend: https://$FRONTEND_DOMAIN"
echo "   - Backend API: https://$BACKEND_DOMAIN/api/todos"
echo ""

echo_success "MySQL root password: ${MYSQL_ROOT_PASSWORD}"
echo_success "Database: ${DB_NAME}, User: ${DB_USER}, Password: ${DB_PASSWORD}"
echo ""

echo_success "Deployment completed!"
echo "🌐 Your frontend will be available at: https://$FRONTEND_DOMAIN"
echo "🌐 Your API will be available at: https://$BACKEND_DOMAIN"
