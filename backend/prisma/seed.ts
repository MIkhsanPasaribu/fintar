import {
  PrismaClient,
  UserRole,
  Gender,
  MaritalStatus,
  RiskLevel,
  ConsultationType,
  ConsultationStatus,
  FinancialType,
  ChatType,
  ChatStatus,
  MessageRole,
  BookingType,
  BookingStatus,
  NotificationType,
} from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Clear existing data (optional - uncomment if needed during development)
  await clearDatabase();

  // Create users first (other entities depend on users)
  const users = await seedUsers();

  // Create consultants (needed for consultations, bookings, reviews)
  const consultants = await seedConsultants();

  // Create related data
  await seedUserProfiles(users);
  await seedFinancialData(users);
  await seedChatSessions(users);
  await seedConsultations(users, consultants);
  await seedBookings(users, consultants);
  await seedReviews(users, consultants);
  await seedNotifications(users);

  console.log("Database seeded successfully");
}

async function clearDatabase() {
  const tablesToClear = [
    "notifications",
    "reviews",
    "bookings",
    "chat_messages",
    "chat_sessions",
    "consultations",
    "financial_data",
    "user_profiles",
    "consultants",
    "users",
  ];

  for (const table of tablesToClear) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
  }

  console.log("Database cleared");
}

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function seedUsers() {
  console.log("Seeding users...");

  const users = [
    {
      id: "user1",
      email: "budi@example.com",
      username: "budi123",
      firstName: "Budi",
      lastName: "Santoso",
      phone: "+6281234567890",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      isVerified: true,
      role: UserRole.CLIENT,
      password: await hashPassword("Password123"),
      preferences: { theme: "dark", language: "id", notifications: true },
      onboardingCompleted: true,
      profileCompleted: true,
      financialDataCompleted: true,
    },
    {
      id: "user2",
      email: "siti@example.com",
      username: "siti_r",
      firstName: "Siti",
      lastName: "Rahayu",
      phone: "+6281298765432",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      isVerified: true,
      role: UserRole.CLIENT,
      password: await hashPassword("Password123"),
      preferences: { theme: "light", language: "id", notifications: true },
      onboardingCompleted: true,
      profileCompleted: true,
      financialDataCompleted: true,
    },
    {
      id: "admin1",
      email: "admin@fintar.id",
      username: "admin",
      firstName: "Admin",
      lastName: "Fintar",
      isVerified: true,
      role: UserRole.ADMIN,
      password: await hashPassword("AdminPass123"),
      preferences: { theme: "dark", language: "id", notifications: true },
      onboardingCompleted: true,
      profileCompleted: false,
      financialDataCompleted: false,
    },
    {
      id: "user3",
      email: "rizky@example.com",
      username: "rizky_m",
      firstName: "Rizky",
      lastName: "Maulana",
      phone: "+6281387654321",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      isVerified: true,
      role: UserRole.CLIENT,
      password: await hashPassword("Password123"),
      preferences: { theme: "dark", language: "id", notifications: true },
      onboardingCompleted: false,
      profileCompleted: false,
      financialDataCompleted: false,
    },
    {
      id: "user4",
      email: "dewi@example.com",
      username: "dewi_s",
      firstName: "Dewi",
      lastName: "Safitri",
      phone: "+6281345678901",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      isVerified: false,
      role: UserRole.CLIENT,
      password: await hashPassword("Password123"),
      onboardingCompleted: false,
      profileCompleted: false,
      financialDataCompleted: false,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }

  console.log(`Seeded ${users.length} users`);
  return users;
}

async function seedConsultants() {
  console.log("Seeding consultants...");

  const consultants = [
    {
      id: "cons1",
      email: "sarah.keuangan@example.com",
      firstName: "Sarah",
      lastName: "Finansial",
      phone: "+6281234567891",
      avatar: "https://randomuser.me/api/portraits/women/10.jpg",
      specialization: ["INVESTMENT_ADVICE", "RETIREMENT_PLANNING"],
      experience: 8,
      rating: 4.8,
      hourlyRate: 350000, // IDR
      bio: "Perencana keuangan bersertifikat dengan fokus pada investasi jangka panjang dan perencanaan pensiun",
      certifications: ["CFP", "RFP"],
      languages: ["id", "en"],
      timeZone: "Asia/Jakarta",
      availability: {
        monday: ["09:00-17:00"],
        tuesday: ["09:00-17:00"],
        wednesday: ["09:00-17:00"],
        thursday: ["09:00-17:00"],
        friday: ["09:00-15:00"],
      },
    },
    {
      id: "cons2",
      email: "andi.konsultan@example.com",
      firstName: "Andi",
      lastName: "Pratama",
      phone: "+6281234567892",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg",
      specialization: ["DEBT_MANAGEMENT", "BUDGETING"],
      experience: 5,
      rating: 4.5,
      hourlyRate: 300000, // IDR
      bio: "Spesialis dalam manajemen utang dan perencanaan anggaran pribadi",
      certifications: ["RFP", "QWP"],
      languages: ["id", "en"],
      timeZone: "Asia/Jakarta",
      availability: {
        monday: ["10:00-15:00"],
        tuesday: ["10:00-15:00"],
        wednesday: ["10:00-15:00"],
        thursday: ["10:00-15:00"],
        friday: ["10:00-13:00"],
      },
    },
    {
      id: "cons3",
      email: "dimas.finance@example.com",
      firstName: "Dimas",
      lastName: "Pratama",
      phone: "+6281334567890",
      avatar: "https://randomuser.me/api/portraits/men/12.jpg",
      specialization: ["INVESTMENT_ADVICE", "RETIREMENT_PLANNING"],
      experience: 10,
      rating: 4.9,
      hourlyRate: 400000, // IDR
      bio: "Pakar investasi dan perencana pensiun dengan pengalaman di pasar modal Indonesia",
      certifications: ["CFP", "CFA Level 3"],
      languages: ["id", "en"],
      timeZone: "Asia/Jakarta",
      availability: {
        monday: ["08:00-16:00"],
        wednesday: ["08:00-16:00"],
        friday: ["08:00-16:00"],
      },
    },
  ];

  for (const consultant of consultants) {
    await prisma.consultant.upsert({
      where: { id: consultant.id },
      update: consultant,
      create: consultant,
    });
  }

  console.log(`Seeded ${consultants.length} consultants`);
  return consultants;
}

async function seedUserProfiles(users: any[]) {
  console.log("Seeding user profiles...");

  const profiles = [
    {
      id: "profile1",
      userId: "user1",
      dateOfBirth: new Date("1990-05-15"),
      gender: Gender.MALE,
      occupation: "Software Engineer",
      company: "Tech Corp",
      monthlyIncome: 12000000,
      monthlyExpenses: 8000000,
      currentSavings: 50000000,
      currentDebt: 5000000,
      emergencyFundAmount: 20000000,
      financialGoals: ["HOUSE_PURCHASE", "RETIREMENT"],
      riskTolerance: RiskLevel.MODERATE,
      investmentExperience: "BEGINNER",
      currentInvestments: {
        stocks: 10000000,
        mutual_funds: 5000000,
      },
      maritalStatus: MaritalStatus.MARRIED,
      dependents: 2,
      educationLevel: "Bachelor's Degree",
      assets: {
        property: 150000000,
        vehicle: 200000000,
      },
      liabilities: {
        mortgage: 100000000,
        car_loan: 50000000,
      },
      insurance: {
        health: true,
        life: false,
        property: true,
      },
      address: {
        street: "Jl. Merdeka No. 123",
        city: "Jakarta",
        province: "DKI Jakarta",
        postalCode: "12345",
      },
      phone: "+6281234567890",
      currency: "IDR",
    },
    {
      id: "profile2",
      userId: "user2",
      dateOfBirth: new Date("1995-11-20"),
      gender: Gender.FEMALE,
      occupation: "Marketing Manager",
      company: "Marketing Inc",
      monthlyIncome: 18000000,
      monthlyExpenses: 12000000,
      currentSavings: 75000000,
      currentDebt: 3000000,
      emergencyFundAmount: 30000000,
      financialGoals: ["TRAVEL", "INVESTMENT_GROWTH"],
      riskTolerance: RiskLevel.HIGH,
      investmentExperience: "INTERMEDIATE",
      currentInvestments: {
        stocks: 25000000,
        crypto: 5000000,
      },
      maritalStatus: MaritalStatus.SINGLE,
      dependents: 0,
      educationLevel: "Master's Degree",
      assets: {
        vehicle: 150000000,
      },
      liabilities: {
        credit_card: 2000000,
      },
      insurance: {
        health: true,
        life: true,
        property: false,
      },
      address: {
        street: "Jl. Sudirman No. 45",
        city: "Jakarta",
        province: "DKI Jakarta",
        postalCode: "12930",
      },
      phone: "+6281298765432",
      currency: "IDR",
    },
  ];

  for (const profile of profiles) {
    await prisma.userProfile.upsert({
      where: { id: profile.id },
      update: profile,
      create: profile,
    });
  }

  console.log(`Seeded ${profiles.length} user profiles`);
}

async function seedFinancialData(users: any[]) {
  console.log("Seeding financial data...");

  const financialData = [
    {
      id: "fin1",
      user: { connect: { id: "user1" } },
      type: FinancialType.INCOME,
      category: "SALARY",
      amount: 12000000,
      currency: "IDR",
      description: "Gaji bulanan",
      date: new Date("2023-09-01"),
      recurring: true,
      frequency: "MONTHLY",
      tags: ["income", "salary"],
    },
    {
      id: "fin2",
      user: { connect: { id: "user1" } },
      type: FinancialType.EXPENSE,
      category: "HOUSING",
      amount: 3000000,
      currency: "IDR",
      description: "Sewa apartemen",
      date: new Date("2023-09-01"),
      recurring: true,
      frequency: "MONTHLY",
      tags: ["housing", "rent"],
    },
    {
      id: "fin3",
      user: { connect: { id: "user2" } },
      type: FinancialType.INCOME,
      category: "SALARY",
      amount: 18000000,
      currency: "IDR",
      description: "Gaji marketing manager",
      date: new Date("2023-09-01"),
      recurring: true,
      frequency: "MONTHLY",
      tags: ["income", "salary"],
    },
  ];

  for (const data of financialData) {
    await prisma.financialData.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }

  console.log(`Seeded ${financialData.length} financial records`);
}

async function seedChatSessions(users: any[]) {
  console.log("Seeding chat sessions...");

  const chatSessions = [
    {
      id: "chat1",
      user: { connect: { id: "user1" } },
      type: ChatType.GENERAL,
      status: ChatStatus.ACTIVE,
      title: "Perencanaan Investasi",
      metadata: { tags: ["investment", "planning"] },
    },
    {
      id: "chat2",
      user: { connect: { id: "user2" } },
      type: ChatType.FINANCIAL_ADVICE,
      status: ChatStatus.ARCHIVED,
      title: "Analisis Portfolio",
      metadata: { tags: ["analysis", "portfolio"] },
    },
  ];

  for (const session of chatSessions) {
    await prisma.chatSession.upsert({
      where: { id: session.id },
      update: session,
      create: session,
    });
  }

  console.log(`Seeded ${chatSessions.length} chat sessions`);
}

async function seedConsultations(users: any[], consultants: any[]) {
  console.log("Seeding consultations...");

  const consultations = [
    {
      id: "cons_session1",
      user: { connect: { id: "user1" } },
      consultant: { connect: { id: "cons1" } },
      type: ConsultationType.FINANCIAL_PLANNING,
      status: ConsultationStatus.SCHEDULED,
      scheduledAt: new Date("2023-10-15T10:00:00Z"),
      duration: 60,
      price: 350000,
      notes: "Konsultasi perencanaan keuangan keluarga",
      meetingLink: "https://zoom.us/j/123456789",
    },
  ];

  for (const consultation of consultations) {
    await prisma.consultation.upsert({
      where: { id: consultation.id },
      update: consultation,
      create: consultation,
    });
  }

  console.log(`Seeded ${consultations.length} consultations`);
}

async function seedBookings(users: any[], consultants: any[]) {
  console.log("Seeding bookings...");

  const bookings = [
    {
      id: "booking1",
      user: { connect: { id: "user1" } },
      consultant: { connect: { id: "cons1" } },
      type: BookingType.CONSULTATION,
      status: BookingStatus.CONFIRMED,
      scheduledAt: new Date("2023-10-20T14:00:00Z"),
      duration: 90,
      price: 350000,
      notes: "Konsultasi investasi jangka panjang",
    },
  ];

  for (const booking of bookings) {
    await prisma.booking.upsert({
      where: { id: booking.id },
      update: booking,
      create: booking,
    });
  }

  console.log(`Seeded ${bookings.length} bookings`);
}

async function seedReviews(users: any[], consultants: any[]) {
  console.log("Seeding reviews...");

  const reviews = [
    {
      id: "review1",
      user: { connect: { id: "user1" } },
      consultant: { connect: { id: "cons1" } },
      rating: 5,
      comment: "Sangat membantu dalam perencanaan keuangan keluarga",
    },
  ];

  for (const review of reviews) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: review,
      create: review,
    });
  }

  console.log(`Seeded ${reviews.length} reviews`);
}

async function seedNotifications(users: any[]) {
  console.log("Seeding notifications...");

  const notifications = [
    {
      id: "notif1",
      user: { connect: { id: "user1" } },
      type: NotificationType.SYSTEM_UPDATE,
      title: "Selamat datang di Fintar!",
      message:
        "Terima kasih telah bergabung dengan Fintar. Mulai perjalanan finansial Anda bersama kami.",
      isRead: false,
      metadata: { priority: "MEDIUM" },
    },
  ];

  for (const notification of notifications) {
    await prisma.notification.upsert({
      where: { id: notification.id },
      update: notification,
      create: notification,
    });
  }

  console.log(`Seeded ${notifications.length} notifications`);
}

main()
  .catch((e) => {
    console.error("Error during database seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
