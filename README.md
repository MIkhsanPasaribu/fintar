<div align="right">

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=Ryan-infitech.fintar)

</div>

# 🏦 Fintar - Solusi Optimalisasi Finansial Pintar Keluarga dan UMKM Berbasis AI

<div align="center">

![preview](preview.gif)

</div>

Fintar adalah platform keuangan berbasis AI yang dirancang khusus untuk memberdayakan keluarga Indonesia dan UMKM dalam mengelola keuangan dengan cerdas, meningkatkan literasi finansial, dan mencapai kebebasan finansial melalui teknologi AI terdepan.

## 🚀 Struktur Proyek

```
fintar/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/              # App router pages
│   │   ├── components/       # Reusable components
│   │   ├── store/            # Zustand state management
│   │   ├── lib/              # Utilities and helpers
│   │   └── types/            # TypeScript definitions
│   ├── public/               # Static assets
│   └── package.json
├── backend/                  # NestJS backend API
│   ├── src/
│   │   ├── auth/             # Authentication module
│   │   ├── users/            # User management
│   │   ├── chat/             # AI chat system
│   │   ├── financial/        # Financial data management
│   │   ├── consultants/      # Consultant management
│   │   └── common/           # Shared modules
│   └── package.json
├── database/                 # Database schemas and configs
│   ├── prisma/               # PostgreSQL schema
│   ├── mongodb/              # MongoDB schemas for AI
│   └── docker-compose.db.yml
├── .github/                  # GitHub workflows and docs
│   └── copilot-instructions.md
└── README.md
```

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: TailwindCSS + Custom Finance Theme
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts / Chart.js
- **Internationalization**: i18next
- **Real-time**: Socket.io-client

### Backend

- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL (Prisma ORM)
- **AI Database**: MongoDB (Mongoose)
- **Authentication**: JWT + Passport
- **API Documentation**: Swagger/OpenAPI
- **Real-time**: Socket.io
- **Security**: Helmet, Rate Limiting, CORS

### AI & Analytics

- **AI Models**: Gemini 2.0 Flash
- **AI Framework**: Langchain.js
- **Vector Database**: MongoDB with embeddings
- **Market Data**: Real-time Indonesian financial APIs

### Infrastructure

- **Frontend Deploy**: Vercel
- **Backend Deploy**: Railway / Docker
- **Database**: PostgreSQL + MongoDB
- **Cache**: Redis
- **Monitoring**: Sentry
- **CI/CD**: GitHub Actions

## 🚦 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### 1. Clone Repository

```bash
git clone <repository-url>
cd fintar
```

### 2. Setup Database

```bash
cd database
docker-compose -f docker-compose.db.yml up -d
```

### 3. Setup Backend

```bash
cd ../backend
npm install
cp .env.example .env
# Edit .env with your configurations
npm run db:migrate
npm run db:generate
npm run db:seed
npm run start:dev
```

### 4. Setup Frontend

```bash
cd ../frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configurations
npm run dev
```

### 5. Access Applications

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **Database Studio**: `npm run db:studio` (from backend folder)

## 🎯 Core Features

### MVP Features

- [x] **User Authentication & Profiles**
- [x] **AI Financial Chat Assistant**
- [x] **Personal Finance Dashboard**
- [x] **Budget Tracking & Analytics**
- [x] **Investment Portfolio Tracking**
- [x] **Financial Education Module**
- [x] **Consultant Booking System**
- [x] **Indonesian Market Integration**

### Advanced Features (Roadmap)

- [ ] **AI Investment Recommendations**
- [ ] **Tax Optimization Tools**
- [ ] **Insurance Planning**
- [ ] **Retirement Calculator**
- [ ] **Debt Management Tools**
- [ ] **Mobile App**
- [ ] **Advanced Analytics**

## 🎨 Design System

### Color Palette (Finance Theme)

```css
/* Primary Brand Colors */
--fintar-primary: #1e40af; /* Professional Blue */
--fintar-secondary: #059669; /* Success Green */
--fintar-accent: #dc2626; /* Alert Red */

/* Neutral Colors */
--fintar-dark: #0f172a; /* Slate 900 */
--fintar-light: #f8fafc; /* Slate 50 */
--fintar-muted: #64748b; /* Slate 500 */

/* Status Colors */
--fintar-success: #10b981; /* Emerald 500 */
--fintar-warning: #f59e0b; /* Amber 500 */
--fintar-error: #ef4444; /* Red 500 */
--fintar-info: #3b82f6; /* Blue 500 */
```

## 📱 Development Commands

### Frontend Commands

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

### Backend Commands

```bash
cd backend
npm run start:dev    # Start development server
npm run build        # Build for production
npm run start:prod   # Start production server
npm run test         # Run tests
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
```

### Database Commands

```bash
cd database
docker-compose -f docker-compose.db.yml up -d     # Start databases
docker-compose -f docker-compose.db.yml down      # Stop databases
docker-compose -f docker-compose.db.yml logs      # View logs
```

## 🌍 Indonesian Market Focus

Fintar dirancang khusus untuk pasar Indonesia dengan fitur:

- **Bahasa Indonesia** support penuh
- **IDR currency** sebagai default
- **Indonesian financial products** (Saham BEI, Reksa Dana, SBN)
- **Local regulations** compliance (OJK)
- **Indonesian banking** integration
- **Tax calculations** sesuai peraturan Indonesia

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: Check `/docs` folder
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Email**: support@fintar.id (when available)

---

**Fintar** - Empowering Indonesian Financial Independence with AI 🇮🇩
