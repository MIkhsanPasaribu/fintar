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

- **LLM Provider**: OpenAI GPT-4 / GPT-4o mini
- **Orkestrasi AI**: Langchain.js
- **Vector Store (opsional)**: Pinecone / Weaviate / Qdrant
- **Prompt Monitoring**: PromptLayer / LangSmith
- **Model Lokal (opsional)**: IndoBERT, IndoGPT (via HuggingFace)

## 📁 FOLDER STRUCTURE

```
fintar/
├── frontend/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/              # App router pages (Next.js 13+)
│   │   │   ├── layout.tsx    # Root layout
│   │   │   ├── page.tsx      # Home page
│   │   │   ├── login/        # Authentication pages
│   │   │   ├── dashboard/    # Main dashboard
│   │   │   ├── chat/         # AI chat interface
│   │   │   ├── education/    # Financial education
│   │   │   └── api/          # API routes (if needed)
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/           # Base UI components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── dashboard/    # Dashboard specific
│   │   │   ├── chat/         # Chat components
│   │   │   ├── education/    # Education components
│   │   │   └── booking/      # Booking system
│   │   ├── store/            # Zustand state management
│   │   │   ├── index.ts      # Store configuration
│   │   │   ├── user.ts       # User state
│   │   │   ├── dashboard.ts  # Dashboard state
│   │   │   └── notification.ts # Notifications
│   │   ├── lib/              # Utilities and helpers
│   │   │   ├── utils.ts      # General utilities
│   │   │   ├── auth.ts       # Auth helpers
│   │   │   └── api.ts        # API client
│   │   └── types/            # TypeScript definitions
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   ├── next.config.ts        # Next.js configuration
│   ├── tailwind.config.js    # TailwindCSS config
│   └── tsconfig.json         # TypeScript config
├── backend/                  # NestJS Backend API
│   ├── src/
│   │   ├── main.ts           # Application entry point
│   │   ├── app.module.ts     # Root module
│   │   ├── auth/             # Authentication module
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── strategies/   # Passport strategies
│   │   ├── users/            # User management
│   │   ├── chat/             # AI chat system
│   │   ├── financial/        # Financial data management
│   │   ├── consultants/      # Consultant management
│   │   └── common/           # Shared modules
│   │       ├── prisma/       # Prisma service
│   │       ├── mongo/        # MongoDB connection
│   │       └── guards/       # Auth guards
│   ├── package.json          # Backend dependencies
│   ├── nest-cli.json         # NestJS CLI config
│   └── tsconfig.json         # TypeScript config
├── database/                 # Database schemas and configs
│   ├── prisma/               # PostgreSQL schema
│   │   ├── schema.prisma     # Main Prisma schema
│   │   ├── migrations/       # Database migrations
│   │   └── seed.ts           # Database seeding
│   ├── mongodb/              # MongoDB schemas
│   │   └── schemas/          # Mongoose schemas
│   ├── docker-compose.db.yml # Database containers
│   └── README.md             # Database documentation
├── .github/                  # GitHub configuration
│   ├── copilot-instructions.md
│   └── workflows/            # CI/CD workflows
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── package.json              # Root package.json (workspace)
├── fintar.code-workspace     # VS Code workspace config
└── README.md                 # Project documentation
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
- OpenAI GPT API
- JWT + Bcrypt
- Socket.io

## 🎯 DAFTAR FITUR FINTAR

### ✅ Fitur Utama (Wajib untuk MVP)

1. **AI Financial Co-Pilot 24/7**
   - Chatbot AI untuk bantu budgeting, saving plan, dll
2. **Fitur Perencanaan Keuangan**
   - Simulasi anggaran, tujuan keuangan jangka pendek/panjang
3. **Fitur Strategi Investasi Personal**
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

### 🎯 Color Identity (Semua background dominan gelap)

**Primary Colors:**

- `#1C1F2B` — primary base
- `#2A2E3B` — primary dark
- `#383C4B` — primary light

**Secondary Colors:**

- `#005F73` — strong trust teal
- `#0A9396` — soft supportive teal
- `#94D2BD` — pastel companion

**Accent Colors:**

- `#EE9B00` — action accent (cta buttons)
- `#CA6702` — hover/press accent
- `#BB3E03` — warning/danger

**Neutral Colors:**

- `#212121` — background dark
- `#1A1A1A` — modal/surface
- `#121212` — header/sidebar

**Font Colors:**

- `#FFFFFF` — main white text
- `#E0E0E0` — secondary text
- `#BDBDBD` — tertiary/muted text

### 🎨 Komponen UI

**Button:**

- Primary: `#EE9B00` (bg) + `#1C1F2B` (text)
- Hover: `#CA6702`
- Disabled: `#383C4B`

**Card / Surface:**

- Background: `#2A2E3B`
- Border: `#383C4B`
- Text: `#FFFFFF`

**Modal:**

- Background: `#1A1A1A`
- Shadow: soft `rgba(0,0,0,0.3)`
- Close Button: `#CA6702`

**Input Field:**

- Background: `#212121`
- Border: `#383C4B`
- Placeholder: `#BDBDBD`
- Focus Ring: `#EE9B00`

## AI Prompt Guidelines

When generating AI financial advice, use this persona:
"Bertindaklah sebagai penasihat keuangan pribadi untuk pengguna berusia 20–35 tahun di Indonesia dengan penghasilan terbatas. Tugasmu adalah membantu mereka membuat rencana tabungan, meminimalisir pengeluaran tidak perlu, dan memberikan motivasi finansial berbasis psikologi keuangan modern."

## Code Style Guidelines

- Use TypeScript strict mode
- Follow Next.js 15 App Router patterns
- Implement proper error handling and loading states
- Use Tailwind utility classes for styling with the specified color palette
- Create reusable components in `/src/components`
- API routes should be in `/src/app/api`
- Focus on dark theme design with glassmorphism effects
- Mobile-first approach for responsive design

## Security Requirements

- Implement rate limiting on APIs
- Use proper authentication with JWT
- Validate all inputs
- Implement CORS properly
- Use Helmet.js for security headers

## 📁 PROJECT STRUCTURE

### 🏗️ Folder Organization

```
fintar/
├── node_modules/                     # Dependencies (shared)
├── .github/                          # GitHub workflows & templates
│   └── copilot-instructions.md
├── .gitignore                        # Git ignore rules
├── README.md                         # Project documentation
├── package.json                      # Root package.json for scripts
├── docker-compose.yml               # Multi-service container setup
│
├── frontend/                         # 🔵 Next.js Frontend Application
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
