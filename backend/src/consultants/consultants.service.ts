import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { CreateConsultantDto, CreateBookingDto, ReviewDto } from "./dto";

@Injectable()
export class ConsultantsService {
  constructor(private prisma: PrismaService) {}

  async getAllConsultants() {
    return this.prisma.consultant.findMany({
      include: {
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });
  }

  async getConsultantById(id: string) {
    return this.prisma.consultant.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: {
            reviews: true,
            bookings: true,
          },
        },
      },
    });
  }

  async createBooking(userId: string, createBookingDto: CreateBookingDto) {
    return this.prisma.booking.create({
      data: {
        userId,
        consultantId: createBookingDto.consultantId,
        scheduledAt: new Date(createBookingDto.scheduledAt),
        type: "CONSULTATION", // Map service to type
        duration: createBookingDto.duration || 60,
        notes: createBookingDto.notes,
        price: 1000000, // Default price in IDR
        status: "PENDING",
      },
      include: {
        consultant: true,
        user: true,
      },
    });
  }

  async getUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: {
        consultant: true,
      },
      orderBy: {
        scheduledAt: "desc",
      },
    });
  }

  async getConsultantBookings(consultantId: string) {
    return this.prisma.booking.findMany({
      where: { consultantId },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "desc",
      },
    });
  }

  async updateBookingStatus(
    bookingId: string,
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  ) {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        consultant: true,
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async createReview(
    userId: string,
    consultantId: string,
    reviewDto: ReviewDto
  ) {
    // Check if user has completed booking with this consultant
    const completedBooking = await this.prisma.booking.findFirst({
      where: {
        userId,
        consultantId,
        status: "COMPLETED",
      },
    });

    if (!completedBooking) {
      throw new Error("You must complete a booking before leaving a review");
    }

    // Check if review already exists for this consultant
    const existingReview = await this.prisma.review.findFirst({
      where: {
        userId,
        consultantId,
      },
    });

    if (existingReview) {
      throw new Error("You have already reviewed this consultant");
    }

    return this.prisma.review.create({
      data: {
        userId,
        consultantId,
        rating: reviewDto.rating,
        comment: reviewDto.comment,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        consultant: true,
      },
    });
  }

  async getConsultantReviews(consultantId: string) {
    return this.prisma.review.findMany({
      where: { consultantId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getConsultantStats(consultantId: string) {
    const [bookingsCount, reviewsCount, avgRating] = await Promise.all([
      this.prisma.booking.count({
        where: { consultantId },
      }),
      this.prisma.review.count({
        where: { consultantId },
      }),
      this.prisma.review.aggregate({
        where: { consultantId },
        _avg: {
          rating: true,
        },
      }),
    ]);

    return {
      totalBookings: bookingsCount,
      totalReviews: reviewsCount,
      averageRating: avgRating._avg.rating || 0,
    };
  }
}
