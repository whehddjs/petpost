#!/bin/bash

# EC2 Setup Script for PetPost
echo "Setting up PetPost on EC2..."

# Update system
sudo yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Create application directory
sudo mkdir -p /var/www/petpost
sudo chown ec2-user:ec2-user /var/www/petpost

# Navigate to app directory
cd /var/www/petpost

# Clone or copy your application files here
# For now, we'll assume files are already copied

# Install dependencies
npm install

# Build the application
npm run build

# Create environment file
cat > .env.local << EOF
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
S3_BUCKET_NAME=petpost-images
EOF

echo "Please update the .env.local file with your actual AWS credentials"

# Start the application with PM2
pm2 start npm --name "petpost" -- start
pm2 startup
pm2 save

# Install and configure nginx (optional, for reverse proxy)
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Create nginx configuration
sudo tee /etc/nginx/conf.d/petpost.conf > /dev/null << EOF
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or EC2 public IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Test nginx configuration and restart
sudo nginx -t
sudo systemctl restart nginx

echo "Setup complete! Your PetPost application should be running."
echo "Access it at http://your-ec2-public-ip"
echo "Don't forget to:"
echo "1. Update .env.local with your AWS credentials"
echo "2. Create an S3 bucket named 'petpost-images' (or update the bucket name)"
echo "3. Configure your EC2 security group to allow HTTP traffic on port 80"
