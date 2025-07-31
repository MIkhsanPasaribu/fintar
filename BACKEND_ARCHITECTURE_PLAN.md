# Fintar Backend Architecture Plan

## 🎯 MVP Fitur Utama

1. **AI Financial Co-Pilot 24/7** - Chatbot AI untuk budgeting, saving plan
2. **Fitur Perencanaan Keuangan Berbasis AI** - Simulasi anggaran, tujuan keuangan
3. **Fitur Strategi Investasi Personal Berbasis AI** - Berdasarkan profil finansial
4. **Marketplace Konsultan Keuangan** - Sistem pencarian + rating konsultan
5. **User Login/Register + Auth** - JWT + Bcrypt
6. **AI-Powered Budget Tracker** - Visualisasi keuangan bulanan

## 🏗️ Backend Architecture

### 🔵 Database Strategy

- **Primary DB**: Supabase PostgreSQL (users, profiles, financial data, consultants, bookings)
- **Secondary DB**: MongoDB (AI chat history, AI logs, session data)
- **ORM**: Prisma (Supabase PostgreSQL), Mongoose (MongoDB)

### 🟢 Module Structure

```
backend/src/
├── auth/                     # Authentication & Authorization
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   └── dto/
│       ├── login.dto.ts
│       ├── register.dto.ts
│       └── auth-response.dto.ts
│
├── users/                    # User Management
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── user-profile.service.ts
│   └── dto/
│       ├── create-user.dto.ts
│       ├── update-user.dto.ts
│       ├── user-profile.dto.ts
│       └── onboarding.dto.ts
│
├── chat/                     # AI Chat Module
│   ├── chat.module.ts
│   ├── chat.controller.ts
│   ├── chat.service.ts
│   ├── ai-chat.service.ts
│   └── dto/
│       ├── chat-message.dto.ts
│       ├── chat-session.dto.ts
│       └── ai-response.dto.ts
│
├── financial/                # Financial Planning & Analysis
│   ├── financial.module.ts
│   ├── financial.controller.ts
│   ├── financial.service.ts
│   ├── budget.service.ts
│   ├── investment.service.ts
│   ├── ai-financial.service.ts
│   └── dto/
│       ├── financial-data.dto.ts
│       ├── budget.dto.ts
│       ├── investment-plan.dto.ts
│       └── financial-goal.dto.ts
│
├── consultants/              # Consultant Marketplace
│   ├── consultants.module.ts
│   ├── consultants.controller.ts
│   ├── consultants.service.ts
│   ├── bookings.service.ts
│   └── dto/
│       ├── consultant.dto.ts
│       ├── booking.dto.ts
│       └── consultant-search.dto.ts
│
├── common/                   # Shared Utilities
│   ├── prisma/
│   │   └── prisma.service.ts
│   ├── mongodb/
│   │   └── mongodb.service.ts
│   ├── supabase/
│   │   └── supabase.service.ts
│   ├── ai/
│   │   └── gemini.service.ts
│   └── utils/
│       ├── encryption.util.ts
│       └── validation.util.ts
│
├── guards/                   # Route Guards
│   ├── auth.guard.ts
│   └── roles.guard.ts
│
├── decorators/               # Custom Decorators
│   ├── user.decorator.ts
│   └── roles.decorator.ts
│
├── pipes/                    # Validation Pipes
│   └── validation.pipe.ts
│
├── filters/                  # Exception Filters
│   └── http-exception.filter.ts
│
├── app.module.ts             # Root Module
└── main.ts                   # Application Entry Point
```

## 🔗 API Endpoints Design

### 🔐 Authentication (`/api/v1/auth`)

```
POST   /register          # User registration
POST   /login             # User login
POST   /logout            # User logout
POST   /refresh           # Refresh JWT token
GET    /profile           # Get current user profile
```

### 👤 Users (`/api/v1/users`)

```
GET    /me                # Get current user
PATCH  /me                # Update current user
GET    /profile           # Get user profile
PATCH  /profile           # Update/create user profile
GET    /onboarding/status # Get onboarding status
PATCH  /onboarding/skip   # Skip onboarding
```

### 💬 AI Chat (`/api/v1/chat`)

```
GET    /sessions          # Get chat sessions
POST   /sessions          # Create new chat session
GET    /sessions/:id      # Get specific session
POST   /sessions/:id/messages  # Send message to AI
DELETE /sessions/:id      # Delete chat session
```

### 💰 Financial (`/api/v1/financial`)

```
GET    /data              # Get financial data
POST   /data              # Create/update financial data
GET    /budget            # Get budget analysis
POST   /budget/simulate   # Simulate budget scenarios
GET    /investments       # Get investment recommendations
POST   /investments/analyze # Analyze investment strategy
GET    /goals             # Get financial goals
POST   /goals             # Create financial goal
PATCH  /goals/:id         # Update financial goal
```

### 👨‍💼 Consultants (`/api/v1/consultants`)

```
GET    /                  # Search consultants
GET    /:id               # Get consultant details
POST   /:id/bookings      # Book consultation
GET    /bookings          # Get user bookings
PATCH  /bookings/:id      # Update booking status
POST   /:id/reviews       # Add consultant review
```

## 🗄️ Database Schema Design

### PostgreSQL (Supabase) - Primary Data

```sql
-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  phone VARCHAR(20),
  avatar TEXT,
  isVerified BOOLEAN DEFAULT false,
  role UserRole DEFAULT 'USER',
  supabaseId TEXT,
  preferences JSONB,
  onboardingCompleted BOOLEAN DEFAULT false,
  profileCompleted BOOLEAN DEFAULT false,
  financialDataCompleted BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- User Profiles
CREATE TABLE user_profiles (
  id TEXT PRIMARY KEY,
  userId TEXT REFERENCES users(id) ON DELETE CASCADE,
  dateOfBirth DATE,
  gender Gender,
  occupation VARCHAR(255),
  company VARCHAR(255),
  maritalStatus MaritalStatus,
  dependents INTEGER DEFAULT 0,
  educationLevel VARCHAR(100),
  address JSONB,
  currency VARCHAR(10) DEFAULT 'IDR',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Financial Data
CREATE TABLE financial_data (
  id TEXT PRIMARY KEY,
  userId TEXT REFERENCES users(id) ON DELETE CASCADE,
  monthlyIncome DECIMAL(15,2),
  monthlyExpenses DECIMAL(15,2),
  currentSavings DECIMAL(15,2),
  currentDebt DECIMAL(15,2),
  emergencyFundAmount DECIMAL(15,2),
  financialGoals TEXT[],
  riskTolerance RiskLevel,
  investmentExperience VARCHAR(50),
  currentInvestments JSONB,
  assets JSONB,
  liabilities JSONB,
  insurance JSONB,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Consultants
CREATE TABLE consultants (
  id TEXT PRIMARY KEY,
  userId TEXT REFERENCES users(id) ON DELETE CASCADE,
  specialization VARCHAR(255),
  experience INTEGER,
  certification TEXT[],
  hourlyRate DECIMAL(10,2),
  bio TEXT,
  location VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  rating DECIMAL(3,2) DEFAULT 0,
  totalReviews INTEGER DEFAULT 0,
  isVerified BOOLEAN DEFAULT false,
  isActive BOOLEAN DEFAULT true,
  availability JSONB,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  userId TEXT REFERENCES users(id) ON DELETE CASCADE,
  consultantId TEXT REFERENCES consultants(id) ON DELETE CASCADE,
  scheduledAt TIMESTAMP NOT NULL,
  duration INTEGER DEFAULT 60,
  status BookingStatus DEFAULT 'PENDING',
  meetingLink TEXT,
  notes TEXT,
  amount DECIMAL(10,2),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  userId TEXT REFERENCES users(id) ON DELETE CASCADE,
  consultantId TEXT REFERENCES consultants(id) ON DELETE CASCADE,
  bookingId TEXT REFERENCES bookings(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### MongoDB - AI & Chat Data

```javascript
// Chat Sessions Collection
{
  _id: ObjectId,
  userId: String,
  sessionId: String,
  title: String,
  type: 'financial_planning' | 'investment_advice' | 'budget_help' | 'general',
  isActive: Boolean,
  metadata: {
    userProfile: Object,
    financialData: Object,
    context: Object
  },
  createdAt: Date,
  updatedAt: Date
}

// Chat Messages Collection
{
  _id: ObjectId,
  sessionId: String,
  userId: String,
  type: 'user' | 'ai',
  content: String,
  aiMetadata: {
    model: String,
    tokens: Number,
    processingTime: Number,
    confidence: Number
  },
  timestamp: Date
}

// AI Analytics Collection
{
  _id: ObjectId,
  userId: String,
  sessionId: String,
  feature: String, // 'chat', 'budget_analysis', 'investment_advice'
  aiModel: String,
  requestData: Object,
  responseData: Object,
  processingTime: Number,
  tokenUsage: Number,
  success: Boolean,
  error: String,
  timestamp: Date
}
```

## 🤖 AI Integration Strategy

### Gemini 2.0 Flash Integration

```typescript
// AI Service Architecture
class GeminiService {
  // Financial advice prompts
  generateFinancialAdvice();
  analyzeBudget();
  createInvestmentStrategy();

  // Chat prompts
  processChatMessage();
  generateContextualResponse();

  // Specialized prompts
  createSavingsPlan();
  analyzeSpendingPattern();
  riskAssessment();
}
```

### AI Prompt Templates

```typescript
const FINANCIAL_ADVISOR_PROMPT = `
Bertindaklah sebagai penasihat keuangan pribadi untuk pengguna berusia 20–35 tahun di Indonesia dengan penghasilan terbatas. 
Tugasmu adalah membantu mereka membuat rencana tabungan, meminimalisir pengeluaran tidak perlu, dan memberikan motivasi finansial berbasis psikologi keuangan modern. 
Gunakan kemampuan analisis Google Gemini untuk memberikan insight yang mendalam dan relevan dengan konteks ekonomi Indonesia.

Data Pengguna:
- Penghasilan bulanan: {monthlyIncome}
- Pengeluaran bulanan: {monthlyExpenses}
- Tabungan saat ini: {currentSavings}
- Tujuan finansial: {financialGoals}
- Toleransi risiko: {riskTolerance}

Berikan saran yang praktis, realistis, dan dapat diterapkan dalam konteks ekonomi Indonesia.
`;
```

## 🔧 Implementation Phases

### Phase 1: Core Infrastructure (Week 1)

- ✅ Setup NestJS project structure
- ✅ Configure Prisma + Supabase
- ✅ Setup MongoDB connection
- ✅ Implement basic auth (JWT + Bcrypt)
- ✅ Create user management module

### Phase 2: AI Chat System (Week 2)

- 🔄 Integrate Gemini 2.0 Flash API
- 🔄 Implement chat sessions & messages
- 🔄 Create AI financial advisor prompts
- 🔄 MongoDB chat history storage

### Phase 3: Financial Planning (Week 3)

- 📋 Financial data management
- 📋 Budget analysis & simulation
- 📋 Investment strategy generation
- 📋 AI-powered recommendations

### Phase 4: Consultant Marketplace (Week 4)

- 📋 Consultant profiles & search
- 📋 Booking system
- 📋 Review & rating system
- 📋 Location-based search

### Phase 5: Integration & Testing (Week 5)

- 📋 Frontend integration
- 📋 End-to-end testing
- 📋 Performance optimization
- 📋 Production deployment

## 🛡️ Security & Best Practices

### Authentication & Authorization

- JWT tokens with refresh mechanism
- Role-based access control (USER, CONSULTANT, ADMIN)
- Password encryption with bcrypt
- Rate limiting for API endpoints

### Data Protection

- Input validation with class-validator
- SQL injection prevention with Prisma ORM
- XSS protection with helmet.js
- CORS configuration for frontend

### AI Security

- API key protection for Gemini
- Rate limiting for AI requests
- User context validation
- Token usage monitoring

## 📊 Monitoring & Analytics

### Logging Strategy

- Winston for structured logging
- Request/response logging
- Error tracking with stack traces
- AI usage analytics

### Performance Monitoring

- API response time tracking
- Database query optimization
- Memory usage monitoring
- AI token usage tracking

## 🚀 Deployment Strategy

### Development

- Local development with Docker
- Hot reloading with NestJS
- Database migrations with Prisma

### Production

- Railway/Fly.io deployment
- Environment variables management
- Database connection pooling
- CDN for static assets

This architecture provides a solid foundation for the Fintar MVP with proper separation of concerns, scalable AI integration, and robust data management.
