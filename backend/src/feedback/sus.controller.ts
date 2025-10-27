import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { SUSService } from "./sus.service";
import { SubmitSUSDto, SUSStatisticsDto, SUSResponseDto } from "./dto/sus.dto";

/**
 * SUS (System Usability Scale) Controller
 * Endpoints untuk submit SUS questionnaire, fetch statistics, dan manage responses
 */
@ApiTags("SUS Questionnaire")
@Controller("api/sus")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SUSController {
  constructor(private readonly susService: SUSService) {}

  /**
   * Submit SUS questionnaire response
   * POST /api/sus/submit
   */
  @Post("submit")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: "Submit SUS questionnaire response",
    description:
      "Submit completed System Usability Scale (SUS) questionnaire with 10 responses. Score will be automatically calculated.",
  })
  @ApiResponse({
    status: 201,
    description: "SUS response successfully submitted",
    type: SUSResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid input (responses must be 1-5)",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - JWT token required",
  })
  async submitSUS(
    @Req() req: any,
    @Body() dto: SubmitSUSDto
  ): Promise<SUSResponseDto> {
    const userId = req.user.userId;
    return this.susService.submitSUSResponse(userId, dto);
  }

  /**
   * Get SUS statistics (aggregated)
   * GET /api/sus/statistics
   */
  @Get("statistics")
  @ApiOperation({
    summary: "Get aggregated SUS statistics",
    description:
      "Retrieve comprehensive SUS statistics including average, median, percentiles, and grade distribution",
  })
  @ApiResponse({
    status: 200,
    description: "SUS statistics retrieved successfully",
    type: SUSStatisticsDto,
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - JWT token required",
  })
  async getSUSStatistics(): Promise<SUSStatisticsDto> {
    return this.susService.getSUSStatistics();
  }

  /**
   * Get user's SUS response history
   * GET /api/sus/user/:userId
   */
  @Get("user/:userId")
  @ApiOperation({
    summary: "Get user's SUS response history",
    description: "Retrieve all SUS responses submitted by a specific user",
  })
  @ApiResponse({
    status: 200,
    description: "User SUS history retrieved successfully",
    type: [SUSResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - JWT token required",
  })
  async getUserSUSHistory(
    @Param("userId") userId: string
  ): Promise<SUSResponseDto[]> {
    return this.susService.getUserSUSHistory(userId);
  }

  /**
   * Get SUS response by ID
   * GET /api/sus/:id
   */
  @Get(":id")
  @ApiOperation({
    summary: "Get SUS response by ID",
    description:
      "Retrieve detailed SUS response including all question answers",
  })
  @ApiResponse({
    status: 200,
    description: "SUS response retrieved successfully",
    type: SUSResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "SUS response not found",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - JWT token required",
  })
  async getSUSResponseById(@Param("id") id: string): Promise<SUSResponseDto> {
    return this.susService.getSUSResponseById(id);
  }

  /**
   * Delete SUS response (admin only)
   * DELETE /api/sus/:id
   */
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: "Delete SUS response",
    description: "Delete a SUS response (admin only)",
  })
  @ApiResponse({
    status: 204,
    description: "SUS response deleted successfully",
  })
  @ApiResponse({
    status: 404,
    description: "SUS response not found",
  })
  @ApiResponse({
    status: 401,
    description: "Unauthorized - JWT token required",
  })
  async deleteSUSResponse(@Param("id") id: string): Promise<void> {
    return this.susService.deleteSUSResponse(id);
  }
}
