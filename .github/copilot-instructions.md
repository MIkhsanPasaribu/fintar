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
