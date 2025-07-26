#!/usr/bin/env pwsh

Write-Host "🚀 Starting Fintar Backend Server..." -ForegroundColor Green

Set-Location "c:\Users\mikhs\OneDrive\Documents\fintar\backend"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Please check your environment configuration." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Write-Host "📝 Found .env.example. You may need to copy it to .env and configure." -ForegroundColor Blue
    }
}

# Start the development server
Write-Host "🏁 Starting NestJS development server..." -ForegroundColor Green
npm run start:dev
