# Fintar Database

This folder contains all database-related configurations and schemas for the Fintar platform.

## Structure

```
database/
├── prisma/
│   ├── schema.prisma          # Main Prisma schema
│   ├── migrations/            # Database migrations
│   └── seed.ts                # Database seeding script
├── mongodb/
│   ├── schemas/               # MongoDB schemas for AI chat data
│   └── collections.md         # Documentation for collections
└── docker-compose.db.yml     # Database containers setup
```

## Databases

### PostgreSQL (Primary Database)

- **Purpose**: Main application data
- **ORM**: Prisma
- **Tables**: Users, Consultants, Consultations, Financial Data, etc.
- **Port**: 5432

### MongoDB (AI & Chat Data)

- **Purpose**: AI chat sessions, conversation history, vector embeddings
- **ODM**: Mongoose
- **Collections**: ChatSessions, AIResponses, UserInteractions
- **Port**: 27017

## Setup

1. **Start databases with Docker:**

   ```bash
   cd database
   docker-compose -f docker-compose.db.yml up -d
   ```

2. **Run Prisma migrations:**

   ```bash
   cd ../backend
   npm run db:migrate
   npm run db:generate
   ```

3. **Seed the database:**
   ```bash
   npm run db:seed
   ```

## Environment Variables

Add these to your `.env` file:

```env
# PostgreSQL
DATABASE_URL="postgresql://fintar_user:fintar_password@localhost:5432/fintar_db?schema=public"

# MongoDB
MONGODB_URI="mongodb://localhost:27017/fintar_ai"
```

## Development Commands

- `npm run db:migrate` - Run pending migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database (CAUTION: Deletes all data)
