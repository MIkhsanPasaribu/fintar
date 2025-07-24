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
  // await clearDatabase();

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
      email: "adi.financial@example.com",
      firstName: "Adi",
      lastName: "Wicaksono",
      phone: "+6281312345678",
      avatar: "https://randomuser.me/api/portraits/men/11.jpg",
      specialization: ["FINANCIAL_PLANNING", "INVESTMENT_ADVICE"],
      experience: 8,
      rating: 4.7,
      hourlyRate: 350000, // IDR
      bio: "Certified Financial Planner dengan pengalaman 8 tahun di industri keuangan",
      certifications: ["CFP", "RFP"],
      languages: ["id", "en"],
      timeZone: "Asia/Jakarta",
      availability: {
        monday: ["09:00-12:00", "13:00-17:00"],
        tuesday: ["09:00-12:00", "13:00-17:00"],
        wednesday: ["09:00-12:00", "13:00-17:00"],
        thursday: ["09:00-12:00", "13:00-17:00"],
        friday: ["09:00-12:00", "13:00-15:00"],
      },
    },
    {
      id: "cons2",
      email: "maya.advisor@example.com",
      firstName: "Maya",
      lastName: "Putri",
      phone: "+6281323456789",
      avatar: "https://randomuser.me/api/portraits/women/11.jpg",
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
      incomeRange: "10000000-15000000",
      financialGoals: ["HOUSE_PURCHASE", "RETIREMENT"],
      riskTolerance: RiskLevel.MODERATE,
      investmentExperience: "BEGINNER",
      maritalStatus: MaritalStatus.MARRIED,
      dependents: 2,
      emergencyFund: true,
      insurance: { health: true, life: false, property: true },
      address: {
        street: "Jl. Merdeka No. 123",
        city: "Jakarta",
        province: "DKI Jakarta",
        postalCode: "12345",
      },
    },
    {
      id: "profile2",
      userId: "user2",
      dateOfBirth: new Date("1995-08-20"),
      gender: Gender.FEMALE,
      occupation: "Marketing Manager",
      incomeRange: "15000000-25000000",
      financialGoals: ["TRAVEL", "INVESTMENT_GROWTH"],
      riskTolerance: RiskLevel.HIGH,
      investmentExperience: "INTERMEDIATE",
      maritalStatus: MaritalStatus.SINGLE,
      dependents: 0,
      emergencyFund: true,
      insurance: { health: true, life: true, property: false },
      address: {
        street: "Jl. Sudirman No. 45",
        city: "Jakarta",
        province: "DKI Jakarta",
        postalCode: "12930",
      },
    },
    {
      id: "profile3",
      userId: "user3",
      dateOfBirth: new Date("1988-03-10"),
      gender: Gender.MALE,
      occupation: "Teacher",
      incomeRange: "5000000-10000000",
      financialGoals: ["EDUCATION", "EMERGENCY_FUND"],
      riskTolerance: RiskLevel.LOW,
      investmentExperience: "BEGINNER",
      maritalStatus: MaritalStatus.MARRIED,
      dependents: 1,
      emergencyFund: false,
      insurance: { health: true, life: false, property: false },
      address: {
        street: "Jl. Pahlawan No. 27",
        city: "Bandung",
        province: "Jawa Barat",
        postalCode: "40115",
      },
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
      userId: "user1",
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
      userId: "user1",
      type: FinancialType.EXPENSE,
      category: "UTILITIES",
      amount: 2500000,
      currency: "IDR",
      description: "Tagihan listrik dan air",
      date: new Date("2023-09-05"),
      recurring: true,
      frequency: "MONTHLY",
      tags: ["expense", "utilities"],
    },
    {
      id: "fin3",
      userId: "user1",
      type: FinancialType.INVESTMENT,
      category: "MUTUAL_FUND",
      amount: 5000000,
      currency: "IDR",
      description: "Investasi reksadana",
      date: new Date("2023-08-15"),
      recurring: false,
      tags: ["investment", "mutual_fund"],
    },
    {
      id: "fin4",
      userId: "user2",
      type: FinancialType.INCOME,
      category: "SALARY",
      amount: 18000000,
      currency: "IDR",
      description: "Gaji bulanan",
      date: new Date("2023-09-01"),
      recurring: true,
      frequency: "MONTHLY",
      tags: ["income", "salary"],
    },
    {
      id: "fin5",
      userId: "user2",
      type: FinancialType.EXPENSE,
      category: "RENT",
      amount: 4500000,
      currency: "IDR",
      description: "Sewa apartemen",
      date: new Date("2023-09-02"),
      recurring: true,
      frequency: "MONTHLY",
      tags: ["expense", "housing"],
    },
    {
      id: "fin6",
      userId: "user3",
      type: FinancialType.DEBT,
      category: "CREDIT_CARD",
      amount: 7500000,
      currency: "IDR",
      description: "Utang kartu kredit",
      date: new Date("2023-09-10"),
      recurring: false,
      tags: ["debt", "credit_card"],
    },
    {
      id: "fin7",
      userId: "user3",
      type: FinancialType.ASSET,
      category: "VEHICLE",
      amount: 150000000,
      currency: "IDR",
      description: "Mobil pribadi",
      date: new Date("2021-05-20"),
      recurring: false,
      tags: ["asset", "vehicle"],
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
  console.log("Seeding chat sessions and messages...");

  const chatSessions = [
    {
      id: "chat1",
      userId: "user1",
      title: "Konsultasi Dana Darurat",
      type: ChatType.FINANCIAL_ADVICE,
      status: ChatStatus.ACTIVE,
      metadata: { context: "emergency_fund" },
      messages: [
        {
          role: MessageRole.USER,
          content:
            "Berapa sebaiknya dana darurat yang saya persiapkan untuk keluarga dengan 2 anak?",
        },
        {
          role: MessageRole.ASSISTANT,
          content:
            "Secara umum, dana darurat untuk keluarga dengan 2 anak disarankan sekitar 6-9 kali pengeluaran bulanan. Dengan pengeluaran Anda sekitar Rp 7 juta per bulan, maka dana darurat idealnya sekitar Rp 42-63 juta. Dana ini sebaiknya disimpan dalam instrumen yang likuid seperti tabungan atau deposito dengan akses mudah.",
        },
        {
          role: MessageRole.USER,
          content:
            "Apakah boleh dana darurat diinvestasikan di reksadana pasar uang?",
        },
        {
          role: MessageRole.ASSISTANT,
          content:
            "Ya, reksadana pasar uang adalah salah satu opsi yang baik untuk dana darurat. Instrumen ini cukup likuid (bisa dicairkan dalam 1-2 hari kerja) dan memberikan imbal hasil lebih baik daripada tabungan biasa dengan risiko yang tetap rendah. Pastikan memilih manajer investasi yang terpercaya dan memperhatikan biaya pengelolaan.",
        },
      ],
    },
    {
      id: "chat2",
      userId: "user2",
      title: "Strategi Investasi Saham",
      type: ChatType.INVESTMENT_HELP,
      status: ChatStatus.ACTIVE,
      metadata: { context: "stock_investment" },
      messages: [
        {
          role: MessageRole.USER,
          content:
            "Saya ingin mulai berinvestasi di saham. Apa saja yang harus saya perhatikan?",
        },
        {
          role: MessageRole.ASSISTANT,
          content:
            "Untuk mulai berinvestasi saham, perhatikan hal-hal berikut:\n1. Pelajari fundamental perusahaan (laporan keuangan, model bisnis, manajemen)\n2. Analisis industri dan persaingan\n3. Diversifikasi portofolio\n4. Investasi jangka panjang untuk hasil optimal\n5. Mulai dengan dana yang Anda siap untuk tidak gunakan dalam 5+ tahun\n6. Gunakan sekuritas terpercaya dengan platform yang user-friendly",
        },
        {
          role: MessageRole.USER,
          content:
            "Berapa persen dari portfolio yang sebaiknya dialokasikan untuk saham?",
        },
        {
          role: MessageRole.ASSISTANT,
          content:
            "Alokasi untuk saham tergantung pada usia, tujuan finansial, dan toleransi risiko Anda. Sebagai panduan umum:\n- Usia muda (20-30an): 70-80% saham\n- Usia menengah (40-50an): 50-60% saham\n- Mendekati pensiun: 30-40% saham\n\nDengan profil Anda sebagai profesional berusia 28 tahun dengan toleransi risiko tinggi, alokasi 70-75% untuk saham bisa menjadi pertimbangan, dengan sisanya di instrumen pendapatan tetap dan kas.",
        },
      ],
    },
    {
      id: "chat3",
      userId: "user3",
      title: "Rencana Pelunasan Utang",
      type: ChatType.DEBT_ASSISTANCE,
      status: ChatStatus.ACTIVE,
      metadata: { context: "debt_management" },
      messages: [
        {
          role: MessageRole.USER,
          content:
            "Saya punya utang kartu kredit Rp 15 juta dengan bunga 2.5% per bulan. Bagaimana cara terbaik melunasinya?",
        },
        {
          role: MessageRole.ASSISTANT,
          content:
            "Untuk melunasi utang kartu kredit dengan bunga tinggi (2.5% per bulan atau 30% per tahun), berikut strategi yang disarankan:\n\n1. Hentikan penggunaan kartu kredit untuk pengeluaran baru\n2. Pertimbangkan opsi KTA (Kredit Tanpa Agunan) dengan bunga lebih rendah (12-15% per tahun) untuk take over utang\n3. Prioritaskan pelunasan utang dengan metode Debt Avalanche (fokus pada utang dengan bunga tertinggi terlebih dahulu)\n4. Alokasikan minimal 20-30% pendapatan untuk cicilan utang\n5. Cari pendapatan tambahan untuk mempercepat pelunasan",
        },
        {
          role: MessageRole.USER,
          content:
            "Apakah sebaiknya menggunakan dana darurat untuk melunasi utang kartu kredit?",
        },
        {
          role: MessageRole.ASSISTANT,
          content:
            "Secara umum, tidak disarankan menggunakan dana darurat untuk melunasi utang kartu kredit, kecuali jika:\n\n1. Anda masih memiliki dana darurat yang cukup setelah pelunasan (minimal 3 bulan pengeluaran)\n2. Situasi pekerjaan Anda stabil\n3. Tidak ada kebutuhan mendesak dalam waktu dekat\n\nMengingat bunga kartu kredit sangat tinggi (30% per tahun), dalam beberapa kasus memang bisa dipertimbangkan menggunakan sebagian dana darurat. Namun tetap sisakan minimal 3 bulan pengeluaran untuk keadaan darurat sesungguhnya.",
        },
      ],
    },
  ];

  for (const session of chatSessions) {
    const { messages, ...sessionData } = session;

    const createdSession = await prisma.chatSession.upsert({
      where: { id: session.id },
      update: sessionData,
      create: sessionData,
    });

    // Create messages for this session
    for (const message of messages) {
      await prisma.chatMessage.create({
        data: {
          sessionId: createdSession.id,
          ...message,
        },
      });
    }
  }

  console.log(`Seeded ${chatSessions.length} chat sessions with messages`);
}

async function seedConsultations(users: any[], consultants: any[]) {
  console.log("Seeding consultations...");

  const consultations = [
    {
      id: "consult1",
      userId: "user1",
      consultantId: "cons1",
      type: ConsultationType.FINANCIAL_PLANNING,
      status: ConsultationStatus.COMPLETED,
      scheduledAt: new Date("2023-08-15T10:00:00Z"),
      duration: 60,
      price: 350000,
      notes: "Perencanaan keuangan untuk pembelian rumah dalam 5 tahun",
      feedback: "Konsultasi sangat membantu, saya mendapatkan insight baru",
      rating: 5,
      meetingLink: "https://meet.example.com/room1",
    },
    {
      id: "consult2",
      userId: "user2",
      consultantId: "cons2",
      type: ConsultationType.DEBT_MANAGEMENT,
      status: ConsultationStatus.SCHEDULED,
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      duration: 45,
      price: 300000,
      notes: "Diskusi strategi untuk pelunasan KPR",
      meetingLink: "https://meet.example.com/room2",
    },
    {
      id: "consult3",
      userId: "user3",
      consultantId: "cons3",
      type: ConsultationType.INVESTMENT_ADVICE,
      status: ConsultationStatus.SCHEDULED,
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      duration: 90,
      price: 600000,
      notes: "Konsultasi portofolio investasi untuk dana pensiun",
      meetingLink: "https://meet.example.com/room3",
    },
    {
      id: "consult4",
      userId: "user1",
      consultantId: "cons3",
      type: ConsultationType.RETIREMENT_PLANNING,
      status: ConsultationStatus.CANCELLED,
      scheduledAt: new Date("2023-08-01T14:00:00Z"),
      duration: 60,
      price: 400000,
      notes: "Dibatalkan karena jadwal bentrok",
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
      userId: "user1",
      consultantId: "cons1",
      type: BookingType.CONSULTATION,
      status: BookingStatus.CONFIRMED,
      scheduledAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      duration: 60,
      price: 350000,
      notes: "Konsultasi awal untuk perencanaan keuangan pribadi",
    },
    {
      id: "booking2",
      userId: "user2",
      consultantId: "cons2",
      type: BookingType.FOLLOW_UP,
      status: BookingStatus.PENDING,
      scheduledAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      duration: 30,
      price: 150000,
      notes: "Follow-up konsultasi sebelumnya",
    },
    {
      id: "booking3",
      userId: "user3",
      consultantId: "cons3",
      type: BookingType.EMERGENCY,
      status: BookingStatus.COMPLETED,
      scheduledAt: new Date("2023-09-01T16:00:00Z"),
      duration: 45,
      price: 450000,
      notes: "Konsultasi darurat terkait pasar saham",
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
      userId: "user1",
      consultantId: "cons1",
      rating: 5,
      comment:
        "Sangat membantu dan memberikan advice yang praktis. Akan konsultasi lagi.",
    },
    {
      id: "review2",
      userId: "user2",
      consultantId: "cons2",
      rating: 4,
      comment:
        "Penjelasan mudah dipahami dan solusi yang diberikan sesuai dengan kebutuhan saya.",
    },
    {
      id: "review3",
      userId: "user3",
      consultantId: "cons3",
      rating: 5,
      comment:
        "Konsultan sangat berpengalaman dan membantu saya memahami strategi investasi dengan lebih baik.",
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
      userId: "user1",
      type: NotificationType.BOOKING_CONFIRMATION,
      title: "Booking Confirmed",
      message:
        "Your consultation with Adi Wicaksono has been confirmed for next Monday at 10:00 AM.",
      isRead: false,
      metadata: { bookingId: "booking1", consultantId: "cons1" },
    },
    {
      id: "notif2",
      userId: "user2",
      type: NotificationType.CONSULTATION_REMINDER,
      title: "Upcoming Consultation",
      message:
        "Reminder: Your consultation with Maya Putri is scheduled tomorrow at 2:00 PM.",
      isRead: true,
      metadata: { consultationId: "consult2", consultantId: "cons2" },
    },
    {
      id: "notif3",
      userId: "user3",
      type: NotificationType.NEW_MESSAGE,
      title: "New Message",
      message: "You have a new message in your debt management chat session.",
      isRead: false,
      metadata: { chatSessionId: "chat3" },
    },
    {
      id: "notif4",
      userId: "user1",
      type: NotificationType.SYSTEM_UPDATE,
      title: "New Feature Available",
      message:
        "We have added new financial calculators! Check them out in the Tools section.",
      isRead: false,
      metadata: { featureId: "calculators" },
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
