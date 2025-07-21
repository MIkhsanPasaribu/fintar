# Copilot Instructions for Fintar Project

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

Fintar is an AI-based Financial Empowerment Platform designed to help individuals and SMEs manage their finances, improve financial literacy, and receive AI-powered financial consultations.

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript, TailwindCSS, Framer Motion
- **State Management**: Zustand
- **Charts**: Chart.js / Recharts
- **Backend**: NestJS with TypeScript
- **Databases**: PostgreSQL (main) via Prisma ORM, MongoDB (AI logs, chat history)
- **Authentication**: JWT + bcrypt.js
- **Real-time**: Socket.io
- **AI**: OpenAI GPT-4 API, LangChain.js, PromptLayer

## Color Scheme & Design Guidelines

- Use professional financial colors:
  - Primary: Deep blue (#1E40AF), Navy (#0F172A)
  - Secondary: Emerald green (#059669), Forest green (#065F46)
  - Accent: Gold (#F59E0B), Amber (#D97706)
  - Neutral: Gray scale (#F8FAFC, #64748B, #334155)
- Focus on user-friendly and responsive design
- Financial dashboard should be clean and professional
- Mobile-first approach for responsive design

## AI Prompt Guidelines

When generating AI financial advice, use this persona:
"Bertindaklah sebagai penasihat keuangan pribadi untuk pengguna berusia 20–35 tahun di Indonesia dengan penghasilan terbatas. Tugasmu adalah membantu mereka membuat rencana tabungan, meminimalisir pengeluaran tidak perlu, dan memberikan motivasi finansial berbasis psikologi keuangan modern."

## Key Features to Implement

1. Personal Financial Dashboard with cashflow visualization
2. AI Financial Copilot (24/7 chatbot)
3. Financial Education Modules with microlearning
4. Real-time Consultation Booking System

## Code Style Guidelines

- Use TypeScript strict mode
- Follow Next.js 15 App Router patterns
- Implement proper error handling and loading states
- Use Tailwind utility classes for styling
- Create reusable components in `/src/components`
- API routes should be in `/src/app/api`

## Security Requirements

- Implement rate limiting on APIs
- Use proper authentication with JWT
- Validate all inputs
- Implement CORS properly
- Use Helmet.js for security headers
