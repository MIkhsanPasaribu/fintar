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

- `#FCF8DD` — main cream background
- `#F9F2C7` — medium cream
- `#F6EBB1` — deep cream

**Secondary Colors:**

- `#00809D` — primary teal blue
- `#006B84` — deep teal
- `#4FA3B8` — light teal
- `#7EC8E3` — sky teal

**Accent Colors:**

- `#FFD700` — bright gold (primary cta)
- `#D3AF37` — antique gold
- `#FFA500` — orange gold
- `#FF8C00` — dark orange

**Supporting Colors:**

- `#2E8B57` — sea green (success)
- `#3CB371` — medium sea green
- `#8B4513` — saddle brown
- `#A0522D` — sienna brown

**Alert Colors:**

- `#DC143C` — crimson (danger)
- `#FF6347` — tomato (warning)
- `#32CD32` — lime green (success)
- `#4169E1` — royal blue (info)

**Neutral Colors:**

- `#F5E6D3` — light tan
- `#E8D5C4` — warm gray
- `#D4C5B9` — taupe
- `#C8B8A6` — mushroom

### 📝 FONT COLORS (Comprehensive)

**Primary Text:**

- `#0D0D0D` — main heading (h1, h2)
- `#1A1A1A` — sub heading (h3, h4)
- `#262626` — body text
- `#333333` — paragraph text

**Secondary Text:**

- `#404040` — subtitle
- `#4D4D4D` — description
- `#595959` — caption
- `#666666` — metadata

**Tertiary Text:**

- `#737373` — placeholder
- `#808080` — disabled text
- `#8C8C8C` — hint text
- `#999999` — helper text

**Specialized Text:**

- `#2F4F4F` — financial data
- `#1C3A3A` — important numbers
- `#556B2F` — positive values
- `#8B0000` — negative values

**Link & Interactive:**

- `#00809D` — link default
- `#006B84` — link hover
- `#4FA3B8` — link visited
- `#D3AF37` — link active

**Status Text:**

- `#2E8B57` — success message
- `#DC143C` — error message
- `#FF8C00` — warning message
- `#4169E1` — info message

**Data Text:**

- `#1C1C1C` — table header
- `#333333` — table content
- `#666666` — table secondary
- `#999999` — table tertiary

**Special Context:**

- `#8B4513` — currency symbol
- `#006B84` — percentage
- `#2F4F4F` — date/time
- `#D3AF37` — highlighted/featured

### 🎨 Komponen UI (Light Theme)

**Button Variants:**

- Primary: `#FFD700` (bg) + `#1C1C1C` (text)
- Secondary: `#00809D` (bg) + `#FCF8DD` (text)
- Success: `#2E8B57` (bg) + `#FCF8DD` (text)
- Warning: `#FFA500` (bg) + `#1C1C1C` (text)
- Danger: `#DC143C` (bg) + `#FCF8DD` (text)

**Card Types:**

- Default: `#F9F2C7` (bg) + `#D3AF37` (border)
- Premium: `#F5E6D3` (bg) + `#FFD700` (border)
- Info: `#7EC8E3` (bg) + `#00809D` (border)
- Success: `#E8F5E9` (bg) + `#2E8B57` (border)

**Navigation:**

- Main Nav: `#006B84` (bg) + `#FCF8DD` (text)
- Sub Nav: `#4FA3B8` (bg) + `#1C1C1C` (text)
- Active: `#FFD700` (accent)
- Hover: `#FFA500` (highlight)

**Data Visualization:**

- Chart 1: `#00809D`
- Chart 2: `#FFD700`
- Chart 3: `#2E8B57`
- Chart 4: `#D3AF37`
- Chart 5: `#4FA3B8`
- Chart 6: `#A0522D`
- Chart 7: `#FF8C00`
- Chart 8: `#8B4513`

### 💼 Special Finance Elements:

**Portfolio Status:**

- Excellent: `#2E8B57` + `#32CD32`
- Good: `#00809D` + `#4FA3B8`
- Average: `#FFA500` + `#FFD700`
- Poor: `#A0522D` + `#8B4513`
- Critical: `#DC143C` + `#FF6347`

**Account Types:**

- Gold: `linear-gradient(135deg, #FFD700, #D3AF37)`
- Platinum: `linear-gradient(135deg, #E5E5E5, #B8B8B8)`
- Diamond: `linear-gradient(135deg, #B9F2FF, #7EC8E3)`
- Standard: `#00809D`

**Market Indicators:**

- Bull Market: `#2E8B57`
- Bear Market: `#DC143C`
- Neutral: `#696969`
- Volatile: `#FF8C00`

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
