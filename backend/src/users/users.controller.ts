import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  UseGuards,
  Param,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { UserProfileService } from "./user-profile.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { GetUser } from "../auth/decorators/get-user.decorator";
import { UserProfileDto } from "./dto/user-profile-complete.dto";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userProfileService: UserProfileService
  ) {}

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get user profile" })
  @ApiResponse({
    status: 200,
    description: "User profile retrieved successfully",
  })
  async getProfile(@GetUser("id") userId: string) {
    return this.userProfileService.getProfile(userId);
  }

  @Post("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create user profile" })
  @ApiResponse({ status: 201, description: "Profile created successfully" })
  async createProfile(
    @GetUser("id") userId: string,
    @Body() profileData: UserProfileDto
  ) {
    return this.userProfileService.createOrUpdateProfile(userId, profileData);
  }

  @Put("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update user profile" })
  @ApiResponse({ status: 200, description: "Profile updated successfully" })
  async updateProfile(
    @GetUser("id") userId: string,
    @Body() updateData: UserProfileDto
  ) {
    return this.userProfileService.updateProfile(userId, updateData);
  }

  @Patch("profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Partially update user profile" })
  @ApiResponse({ status: 200, description: "Profile updated successfully" })
  async patchProfile(
    @GetUser("id") userId: string,
    @Body() updateData: Partial<UserProfileDto>
  ) {
    return this.userProfileService.updateProfile(userId, updateData);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({ status: 200, description: "User retrieved successfully" })
  async getUserById(@Param("id") id: string) {
    return this.usersService.findById(id);
  }
}
