// MongoDB Collections for AI Chat System

// Chat Sessions Collection
const chatSessionSchema = {
  _id: "ObjectId",
  userId: "String", // Reference to Prisma User.id
  sessionId: "String", // Unique session identifier
  title: "String",
  type: "String", // "financial_advice", "investment_help", etc.
  status: "String", // "active", "archived", "deleted"
  metadata: {
    context: "String", // Financial context/background
    goals: ["String"], // User's financial goals for this session
    riskProfile: "String", // User's risk tolerance
    timeframe: "String", // Investment/planning timeframe
  },
  messages: [
    {
      role: "String", // "user" | "assistant" | "system"
      content: "String",
      timestamp: "Date",
      metadata: {
        confidence: "Number", // AI confidence score
        sources: ["String"], // Reference sources
        calculations: "Object", // Financial calculations
        recommendations: ["String"],
      },
    },
  ],
  summary: {
    keyPoints: ["String"],
    recommendations: ["String"],
    followUpActions: ["String"],
    riskAssessment: "String",
  },
  vectorEmbeddings: [
    {
      messageIndex: "Number",
      embedding: ["Number"], // Vector representation for similarity search
      keywords: ["String"],
    },
  ],
  createdAt: "Date",
  updatedAt: "Date",
  lastActivity: "Date",
};

// AI Knowledge Base Collection
const knowledgeBaseSchema = {
  _id: "ObjectId",
  category: "String", // "investment", "insurance", "loans", etc.
  subcategory: "String",
  title: "String",
  content: "String",
  tags: ["String"],
  language: "String", // "id", "en"
  region: "String", // "indonesia", "global"
  lastUpdated: "Date",
  vectorEmbedding: ["Number"],
  metadata: {
    sourceType: "String", // "regulation", "market_data", "educational"
    reliability: "Number", // 0-1 score
    lastVerified: "Date",
  },
};

// User Interaction Analytics
const userInteractionSchema = {
  _id: "ObjectId",
  userId: "String",
  sessionId: "String",
  interactionType: "String", // "question", "clarification", "follow_up"
  query: "String",
  aiResponse: "String",
  feedback: {
    helpful: "Boolean",
    rating: "Number", // 1-5
    comment: "String",
  },
  context: {
    financialSituation: "Object",
    previousQueries: ["String"],
    userProfile: "Object",
  },
  timestamp: "Date",
  responseTime: "Number", // AI response time in ms
  tokenUsage: {
    prompt: "Number",
    completion: "Number",
    total: "Number",
  },
};

// Financial Market Data Cache
const marketDataSchema = {
  _id: "ObjectId",
  symbol: "String", // "BBRI.JK", "USD/IDR", etc.
  type: "String", // "stock", "forex", "crypto", "commodity"
  data: {
    price: "Number",
    change: "Number",
    changePercent: "Number",
    volume: "Number",
    marketCap: "Number",
    pe: "Number",
    dividend: "Number",
  },
  timestamp: "Date",
  source: "String", // "yahoo_finance", "investing_com", etc.
  metadata: {
    currency: "String",
    exchange: "String",
    sector: "String",
  },
};

// AI Model Performance Tracking
const modelPerformanceSchema = {
  _id: "ObjectId",
  modelVersion: "String",
  sessionId: "String",
  metrics: {
    accuracy: "Number",
    relevance: "Number",
    helpfulness: "Number",
    responseTime: "Number",
  },
  userFeedback: {
    explicit: {
      rating: "Number",
      helpful: "Boolean",
      comments: "String",
    },
    implicit: {
      sessionDuration: "Number",
      followUpQuestions: "Number",
      actionsTaken: ["String"],
    },
  },
  timestamp: "Date",
};
