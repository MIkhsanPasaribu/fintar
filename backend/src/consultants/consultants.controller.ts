import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { ConsultantsService } from "./consultants.service";
import { CreateBookingDto, ReviewDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetUser } from "../auth/decorators/get-user.decorator";

@ApiTags("consultants")
@Controller("consultants")
export class ConsultantsController {
  constructor(private readonly consultantsService: ConsultantsService) {}

  @Get()
  @ApiOperation({ summary: "Get all consultants" })
  @ApiResponse({ status: 200, description: "List of all consultants" })
  async getAllConsultants() {
    return this.consultantsService.getAllConsultants();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get consultant by ID" })
  @ApiResponse({ status: 200, description: "Consultant details" })
  async getConsultantById(@Param("id") id: string) {
    return this.consultantsService.getConsultantById(id);
  }

  @Get(":id/reviews")
  @ApiOperation({ summary: "Get consultant reviews" })
  @ApiResponse({ status: 200, description: "List of consultant reviews" })
  async getConsultantReviews(@Param("id") consultantId: string) {
    return this.consultantsService.getConsultantReviews(consultantId);
  }

  @Get(":id/stats")
  @ApiOperation({ summary: "Get consultant statistics" })
  @ApiResponse({ status: 200, description: "Consultant statistics" })
  async getConsultantStats(@Param("id") consultantId: string) {
    return this.consultantsService.getConsultantStats(consultantId);
  }

  @Post("bookings")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new booking" })
  @ApiResponse({ status: 201, description: "Booking created successfully" })
  async createBooking(
    @GetUser("id") userId: string,
    @Body() createBookingDto: CreateBookingDto
  ) {
    return this.consultantsService.createBooking(userId, createBookingDto);
  }

  @Get("bookings/my")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user bookings" })
  @ApiResponse({ status: 200, description: "List of user bookings" })
  async getUserBookings(@GetUser("id") userId: string) {
    return this.consultantsService.getUserBookings(userId);
  }

  @Patch("bookings/:id/status")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update booking status" })
  @ApiResponse({ status: 200, description: "Booking status updated" })
  async updateBookingStatus(
    @Param("id") bookingId: string,
    @Body()
    body: { status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" }
  ) {
    return this.consultantsService.updateBookingStatus(bookingId, body.status);
  }

  @Post("bookings/:id/review")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a review for completed booking" })
  @ApiResponse({ status: 201, description: "Review created successfully" })
  async createReview(
    @GetUser("id") userId: string,
    @Param("id") bookingId: string,
    @Body() reviewDto: ReviewDto
  ) {
    return this.consultantsService.createReview(userId, bookingId, reviewDto);
  }
}
