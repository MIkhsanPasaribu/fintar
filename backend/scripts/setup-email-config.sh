#!/bin/bash

# Email Configuration Setup Script for Fintar
# This script helps you configure SMTP settings for email verification

echo "🔧 Fintar Email Configuration Setup"
echo "=================================="
echo ""

# Check if .env file exists
if [ ! -f "/workspaces/fintar/backend/.env" ]; then
    echo "❌ Error: .env file not found in backend directory"
    exit 1
fi

echo "📧 Current Email Configuration:"
echo "SMTP_HOST: $(grep SMTP_HOST /workspaces/fintar/backend/.env | cut -d'=' -f2)"
echo "SMTP_PORT: $(grep SMTP_PORT /workspaces/fintar/backend/.env | cut -d'=' -f2)"
echo "SMTP_USER: $(grep SMTP_USER /workspaces/fintar/backend/.env | cut -d'=' -f2)"
echo "SMTP_FROM: $(grep SMTP_FROM /workspaces/fintar/backend/.env | cut -d'=' -f2)"
echo ""

read -p "Do you want to update email configuration? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📝 Please provide your SMTP configuration:"
    echo ""
    
    read -p "SMTP Host (default: smtp.gmail.com): " smtp_host
    smtp_host=${smtp_host:-smtp.gmail.com}
    
    read -p "SMTP Port (default: 587): " smtp_port
    smtp_port=${smtp_port:-587}
    
    read -p "SMTP User (your-email@gmail.com): " smtp_user
    
    echo ""
    echo "🔐 For Gmail, you need to generate an App Password:"
    echo "1. Go to Google Account settings"
    echo "2. Enable 2-Factor Authentication"
    echo "3. Generate App Password for 'Mail'"
    echo "4. Use that App Password below (not your regular password)"
    echo ""
    
    read -s -p "SMTP Password (App Password): " smtp_pass
    echo ""
    
    read -p "SMTP From Name (default: Fintar): " smtp_from_name
    smtp_from_name=${smtp_from_name:-Fintar}
    
    # Update .env file
    echo ""
    echo "🔄 Updating .env file..."
    
    # Use sed to update the values
    sed -i "s/^SMTP_HOST=.*/SMTP_HOST=$smtp_host/" /workspaces/fintar/backend/.env
    sed -i "s/^SMTP_PORT=.*/SMTP_PORT=$smtp_port/" /workspaces/fintar/backend/.env
    sed -i "s/^SMTP_USER=.*/SMTP_USER=$smtp_user/" /workspaces/fintar/backend/.env
    sed -i "s/^SMTP_PASS=.*/SMTP_PASS=$smtp_pass/" /workspaces/fintar/backend/.env
    sed -i "s/^SMTP_FROM=.*/SMTP_FROM=$smtp_from_name <$smtp_user>/" /workspaces/fintar/backend/.env
    
    echo "✅ Email configuration updated successfully!"
    echo ""
    echo "📋 New Configuration:"
    echo "SMTP_HOST: $smtp_host"
    echo "SMTP_PORT: $smtp_port"
    echo "SMTP_USER: $smtp_user"
    echo "SMTP_FROM: $smtp_from_name <$smtp_user>"
    echo ""
    echo "🔄 Please restart your backend server to apply changes:"
    echo "cd backend && npm run start:dev"
    
elif [[ $REPLY =~ ^[Nn]$ ]]; then
    echo ""
    echo "📧 To configure email manually, update these variables in /workspaces/fintar/backend/.env:"
    echo ""
    echo "SMTP_HOST=smtp.gmail.com"
    echo "SMTP_PORT=587"
    echo "SMTP_SECURE=false"
    echo "SMTP_USER=your-email@gmail.com"
    echo "SMTP_PASS=your-app-password"
    echo "SMTP_FROM=Fintar <your-email@gmail.com>"
    echo ""
    echo "💡 For Gmail:"
    echo "1. Enable 2-Factor Authentication"
    echo "2. Generate App Password (not regular password)"
    echo "3. Use App Password as SMTP_PASS"
fi

echo ""
echo "🧪 Test your email configuration:"
echo "cd backend && node scripts/test-email-verification.js"
echo ""
echo "🚀 Start the application:"
echo "# Terminal 1: cd backend && npm run start:dev"
echo "# Terminal 2: cd frontend && npm run dev"
echo ""
echo "✨ Visit http://localhost:3000/register to test email verification!"
