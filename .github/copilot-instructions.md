# Copilot Instructions for Fintar Project

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## 🔰 Project Overview

**Fintar (Finance Pintar)**
Kategori: _Finance Consulting and Management_

Fintar adalah AI-based Financial Empowerment Platform yang dirancang untuk membantu individu dan UKM mengelola keuangan mereka, meningkatkan literasi keuangan, dan menerima konsultasi keuangan bertenaga AI.

## ✅ FINALIZED TECH STACK — FINTAR

### 🔵 Frontend (Web Client)

- **Framework**: Next.js (TypeScript)
- **Styling**: TailwindCSS + Framer Motion
- **State Management**: Zustand / Redux Toolkit
- **Form Validation**: React Hook Form + Zod/Yup
- **Visualisasi Data**: Recharts / Chart.js
- **Multibahasa**: i18next (Indonesia & Inggris)
- **Realtime UI**: socket.io-client
- **Auth UI**: JWT-based Protected Routes

### 🟢 Backend (Server & API)

- **Framework**: NestJS (TypeScript)
- **Fallback Framework**: Express.js
- **API**: RESTful API (utama), GraphQL (opsional)
- **Modularisasi**: ES Modules + CORS
- **Auth**: JWT (access & refresh token), Role-based Auth
- **Password Encryption**: Bcrypt
- **Realtime Comms**: Socket.io
- **Rate Limiting & Security**: Helmet.js + express-rate-limit
- **External API Request**: Axios

### 🟣 Database & ORM

- **Main DB**: PostgreSQL (untuk transaksi, pengguna, forum, dll)
- **ORM**: Prisma
- **Second DB**: MongoDB (untuk histori chat AI, log AI, dsb)
- **ODM**: Mongoose

### 🧠 AI Engine & Orchestration

- **LLM Provider**: Google Gemini 1.5 Pro / Gemini 1.5 Flash
- **Orkestrasi AI**: Langchain.js
- **Vector Store (opsional)**: Pinecone / Weaviate / Qdrant
- **Prompt Monitoring**: PromptLayer / LangSmith
- **Model Lokal (opsional)**: IndoBERT, IndoGPT (via HuggingFace)

## 📁 PROJECT STRUCTURE

### 🏗️ Folder Organization

```
fintar/
├── .github/                          # GitHub workflows & templates
│   └── copilot-instructions.md
├── README.md                         # Project documentation
│
├── frontend/                         # 🔵 Next.js Frontend Application and root
│   ├── node_modules/                 # Frontend-specific dependencies
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── app/                      # Next.js 15 App Router
│   │   │   ├── (auth)/              # Auth route groups
│   │   │   ├── api/                 # API routes (if needed)
│   │   │   ├── dashboard/           # Dashboard pages
│   │   │   ├── landing/             # Landing page
│   │   │   ├── globals.css          # Global styles
│   │   │   ├── layout.tsx           # Root layout
│   │   │   └── page.tsx             # Home page
│   │   ├── components/              # React components
│   │   │   ├── ui/                  # Base UI components
│   │   │   ├── chat/                # AI chat components
│   │   │   ├── dashboard/           # Dashboard components
│   │   │   ├── layout/              # Layout components
│   │   │   └── forms/               # Form components
│   │   ├── store/                   # Zustand stores
│   │   ├── lib/                     # Utility functions
│   │   ├── types/                   # TypeScript types
│   │   └── hooks/                   # Custom React hooks
│   ├── package.json                 # Frontend dependencies
│   ├── next.config.js               # Next.js configuration
│   ├── tailwind.config.js           # TailwindCSS config
│   ├── tsconfig.json                # TypeScript config
│   └── Dockerfile                   # Frontend container
│
├── backend/                          # 🟢 NestJS Backend API
│   ├── node_modules/                 # Backend-specific dependencies
│   ├── src/
│   │   ├── auth/                     # Authentication module
│   │   ├── users/                    # User management
│   │   ├── chat/                     # AI chat module
│   │   ├── financial/                # Financial planning
│   │   ├── consultants/              # Consultant marketplace
│   │   ├── common/                   # Shared utilities
│   │   ├── guards/                   # Route guards
│   │   ├── decorators/               # Custom decorators
│   │   ├── pipes/                    # Validation pipes
│   │   ├── filters/                  # Exception filters
│   │   ├── main.ts                   # Application entry point
│   │   └── app.module.ts             # Root module
│   ├── test/                         # Test files
│   ├── prisma/                       # Prisma schema & migrations
│   │   ├── schema.prisma             # Database schema
│   │   ├── migrations/               # Migration files
│   │   └── seed.ts                   # Database seeding
│   ├── package.json                  # Backend dependencies
│   ├── nest-cli.json                 # NestJS CLI config
│   ├── tsconfig.json                 # TypeScript config
│   └── Dockerfile                    # Backend container
│
├── database/                         # 🟣 Database Scripts & Config
│   ├── postgresql/                   # PostgreSQL setup
│   │   ├── init/                     # Initialization scripts
│   │   ├── backups/                  # Database backups
│   │   └── docker-compose.postgres.yml
│   ├── mongodb/                      # MongoDB setup
│   │   ├── init/                     # Initialization scripts
│   │   ├── data/                     # Data files
│   │   └── docker-compose.mongo.yml
│   ├── redis/                        # Redis configuration
│   │   └── redis.conf
│   └── scripts/                      # Database utility scripts
│       ├── setup.sh                  # Initial setup
│       ├── migrate.sh                # Migration runner
│       └── backup.sh                 # Backup utility
│
└── docs/                             # 📚 Project Documentation
    ├── api/                          # API documentation
    ├── deployment/                   # Deployment guides
    ├── development/                  # Development setup
    └── architecture/                 # System architecture
```

## 🚀 DEVELOPMENT COMMANDS

### Root Commands (from project root):

- `npm run setup` - Complete project setup
- `npm run dev` - Start all services (database + backend + frontend)
- `npm run build` - Build all applications
- `npm run test` - Run all tests
- `npm run lint` - Lint all code

### Frontend Commands (cd frontend):

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Backend Commands (cd backend):

- `npm run start:dev` - Start NestJS development server
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

### Database Commands:

- `npm run db:start` - Start database containers
- `npm run db:stop` - Stop database containers
- `npm run db:setup` - Complete database setup

## 📱 APPLICATION PORTS

- **Frontend (Next.js)**: http://localhost:3000
- **Backend (NestJS)**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **PostgreSQL**: localhost:5432
- **MongoDB**: localhost:27017
- **Redis**: localhost:6379
- **Prisma Studio**: http://localhost:5555

### 🔗 Blockchain Layer (Opsional)

- **Platform**: Polygon zkEVM / BNB Smart Chain
- **Smart Contract**: Solidity + Hardhat
- **Decentralized Credential**: Blockcerts + IPFS

### 🟠 DevOps & Deployment

- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway / Fly.io / Render
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Monitoring & Logging**: Sentry
- **User Behavior Analytics**: PostHog / Mixpanel

### 🟤 Analytics & Business Intelligence

- **Admin Dashboard**: Metabase / Supabase Studio
- **User Insight**: Google Analytics 4, Mixpanel
- **Event Tracking**: Logging ke PostgreSQL / MongoDB

### 🔔 Integrasi & Ekstensi Pendukung

- **Payment Gateway**: Midtrans, Xendit, DANA SDK
- **Push Notification**: Firebase Cloud Messaging
- **Email Auth (opsional)**: Supabase Auth / Magic Link

### 🔹 MVP Fokus Tech Stack (Untuk Tahap Awal)

- PostgreSQL + Prisma
- NestJS + REST API
- Next.js + TailwindCSS
- Google Gemini API
- JWT + Bcrypt
- Socket.io

## 🎯 DAFTAR FITUR FINTAR

### ✅ Fitur Utama (Wajib untuk MVP)

1. **AI Financial Co-Pilot 24/7**
   - Chatbot AI untuk bantu budgeting, saving plan, dll
2. **Fitur Perencanaan Keuangan Berbasis AI**
   - Simulasi anggaran, tujuan keuangan jangka pendek/panjang
3. **Fitur Strategi Investasi Personal Berbasis AI**
   - Berdasarkan pendapatan, utang, pekerjaan, dan toleransi risiko
4. **Marketplace Konsultan Keuangan**
   - Sistem pencarian berbasis lokasi + rating konsultan
5. **User Login/Register + Auth**
   - JWT + Enkripsi password (Bcrypt)
6. **AI-Powered Budget Tracker**
   - Visualisasi keuangan bulanan berdasarkan input pengguna

### ✅ Fitur Opsional (Jika Ada Waktu)

7. **Shortcut Pintasan ke Website dari Home App**
8. **Pemantauan Harga Pasar**
   - Emas, saham, crypto, silver, real-time via API
9. **Forum Diskusi (Anonymous User)**
   - Diskusi publik soal investasi, pinjaman, keuangan
10. **Integrasi dengan Broker Saham / Reksadana**
    - Redirect API ke mitra penjual
11. **Push Notifikasi Tips Harian**
    - Via FCM (Firebase Cloud Messaging)

## 🎨 WARNA PALETTE – MODERN FINANCE THEME

### 🎯 Color Identity

**Primary Colors:**

- `#FFFFFF` — main white background
- `#FAFBFC` — light gray white
- `#F5F7FA` — soft gray white

**Secondary Colors:**

- `#003D82` — deep navy blue
- `#0052CC` — primary blue
- `#0066FF` — bright blue
- `#4A90E2` — sky blue

**Accent Colors:**

- `#FFB800` — golden yellow (primary cta)
- `#F5A623` — hover gold
- `#1976D2` — action blue
- `#2196F3` — light action blue

**Supporting Colors:**

- `#00C853` — green (success)
- `#4CAF50` — medium green
- `#546E7A` — blue gray
- `#78909C` — light blue gray

**Alert Colors:**

- `#D32F2F` — red (danger)
- `#FF9800` — orange (warning)
- `#4CAF50` — green (success)
- `#2196F3` — blue (info)

**Neutral Colors:**

- `#F8F9FA` — light background
- `#E9ECEF` — border gray
- `#DEE2E6` — divider gray
- `#CED4DA` — disabled gray

### 📝 FONT COLORS (Comprehensive)

**Primary Text:**

- `#0A1628` — main heading (h1, h2)
- `#1A237E` — sub heading (h3, h4)
- `#283593` — body text
- `#37474F` — paragraph text

**Secondary Text:**

- `#455A64` — subtitle
- `#546E7A` — description
- `#607D8B` — caption
- `#78909C` — metadata

**Tertiary Text:**

- `#90A4AE` — placeholder
- `#B0BEC5` — disabled text
- `#CFD8DC` — hint text
- `#ECEFF1` — light helper text

**Specialized Text:**

- `#003D82` — financial data
- `#0052CC` — important numbers
- `#00C853` — positive values
- `#D32F2F` — negative values

**Link & Interactive:**

- `#0052CC` — link default
- `#003D82` — link hover
- `#4A90E2` — link visited
- `#FFB800` — link active

**Status Text:**

- `#00C853` — success message
- `#D32F2F` — error message
- `#FF9800` — warning message
- `#2196F3` — info message

**Data Text:**

- `#0A1628` — table header
- `#37474F` — table content
- `#607D8B` — table secondary
- `#90A4AE` — table tertiary

**Special Context:**

- `#003D82` — currency symbol
- `#0052CC` — percentage
- `#455A64` — date/time
- `#FFB800` — highlighted/featured

### 🎨 Komponen UI (Light Theme)

**Button Variants:**

- Primary: `#0052CC` (bg) + `#FFFFFF` (text)
- Secondary: `#FFB800` (bg) + `#0A1628` (text)
- Success: `#00C853` (bg) + `#FFFFFF` (text)
- Warning: `#FF9800` (bg) + `#FFFFFF` (text)
- Danger: `#D32F2F` (bg) + `#FFFFFF` (text)

**Card Types:**

- Default: `#FFFFFF` (bg) + `#E9ECEF` (border)
- Premium: `#F5F7FA` (bg) + `#FFB800` (border)
- Info: `#E3F2FD` (bg) + `#2196F3` (border)
- Success: `#E8F5E9` (bg) + `#4CAF50` (border)

**Navigation:**

- Main Nav: `#003D82` (bg) + `#FFFFFF` (text)
- Sub Nav: `#0052CC` (bg) + `#FFFFFF` (text)
- Active: `#FFB800` (accent)
- Hover: `#0066FF` (highlight)

**Data Visualization:**

- Chart 1: `#003D82`
- Chart 2: `#0052CC`
- Chart 3: `#2196F3`
- Chart 4: `#4A90E2`
- Chart 5: `#FFB800`
- Chart 6: `#4CAF50`
- Chart 7: `#FF9800`
- Chart 8: `#78909C`

### 💼 Special Finance Elements:

**Portfolio Status:**

- Excellent: `#00C853` + `#4CAF50`
- Good: `#0052CC` + `#2196F3`
- Average: `#FFB800` + `#F5A623`
- Poor: `#FF9800` + `#F57C00`
- Critical: `#D32F2F` + `#B71C1C`

**Account Types:**

- Gold: `linear-gradient(135deg, #FFB800, #F5A623)`
- Platinum: `linear-gradient(135deg, #546E7A, #78909C)`
- Diamond: `linear-gradient(135deg, #2196F3, #0052CC)`
- Standard: `#0052CC`

**Market Indicators:**

- Bull Market: `#00C853`
- Bear Market: `#D32F2F`
- Neutral: `#78909C`
- Volatile: `#FF9800`

## AI Prompt Guidelines (Google Gemini)

When generating AI financial advice, use this persona:
"Bertindaklah sebagai penasihat keuangan pribadi untuk pengguna berusia 20–35 tahun di Indonesia dengan penghasilan terbatas. Tugasmu adalah membantu mereka membuat rencana tabungan, meminimalisir pengeluaran tidak perlu, dan memberikan motivasi finansial berbasis psikologi keuangan modern. Gunakan kemampuan analisis Google Gemini untuk memberikan insight yang mendalam dan relevan dengan konteks ekonomi Indonesia."

### Gemini-Specific Features:

- Leverage larger context window (8192 tokens) for comprehensive financial analysis
- Utilize multimodal capabilities for financial document analysis
- Take advantage of advanced reasoning for complex financial scenarios
- Use Indonesian financial market knowledge for localized advice

## Code Style Guidelines

- Use TypeScript strict mode
- Follow Next.js 15 App Router patterns
- Implement proper error handling and loading states
- Use Tailwind utility classes for styling with the specified color palette
- Create reusable components in `/src/components`
- API routes should be in `/src/app/api`
- Support both light and dark theme with theme toggle functionality
- Mobile-first approach for responsive design
- Implement glassmorphism effects for both themes

## Security Requirements

- Implement rate limiting on APIs
- Use proper authentication with JWT
- Validate all inputs
- Implement CORS properly
- Use Helmet.js for security headers

### 🚀 Development Commands

**Root Level Commands:**

```bash
npm run dev              # Start all services (frontend + backend + db)
npm run build            # Build all applications
npm run test             # Run all tests
npm run docker:up        # Start with Docker Compose
npm run docker:down      # Stop Docker services
```

**Frontend Commands:**

```bash
cd frontend
npm run dev              # Start Next.js development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
```

**Backend Commands:**

```bash
cd backend
npm run start:dev        # Start NestJS in development mode
npm run build            # Build TypeScript
npm run start:prod       # Start production server
npm run test             # Run unit tests
npm run test:e2e         # Run end-to-end tests
npm run db:migrate       # Run Prisma migrations
npm run db:seed          # Seed database
```

### 🐳 Docker Integration

- Each service (frontend, backend) has its own Dockerfile
- Root `docker-compose.yml` orchestrates all services
- Database services run in separate containers
- Development and production environment configurations
- Hot reloading enabled for development containers

### 🔧 Configuration Management

- Environment variables per service (`.env.local`, `.env.production`)
- Shared configuration through root package.json scripts
- Service-specific configurations in respective directories
- Docker environment variable injection
- CI/CD pipeline configuration in `.github/workflows/`
