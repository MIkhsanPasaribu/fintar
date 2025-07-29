import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Req,
  Logger,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserProfileService } from "./user-profile.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  CreateUserProfileDto,
  UpdateUserProfileDto,
  SkipOnboardingDto,
} from "./dto/user-profile.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("users")
@UsePipes(new ValidationPipe())
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly userProfileService: UserProfileService
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getCurrentUser(@Req() req: any) {
    return this.usersService.findOne(req.user.userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }

  // Profile Management
  @UseGuards(JwtAuthGuard)
  @Post("profile")
  createProfile(
    @Req() req: any,
    @Body() createProfileDto: CreateUserProfileDto
  ) {
    return this.userProfileService.createProfile(
      req.user.userId,
      createProfileDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getProfile(@Req() req: any) {
    this.logger.log(`[DEBUG] Getting profile for user: ${req.user.userId}`);
    this.logger.log(`[DEBUG] User object: ${JSON.stringify(req.user)}`);

    const profile = await this.userProfileService.getProfile(req.user.userId);
    this.logger.log(`[DEBUG] Profile query result: ${JSON.stringify(profile)}`);
    this.logger.log(`[DEBUG] Profile found: ${!!profile}`);

    return profile;
  }

  @UseGuards(JwtAuthGuard)
  @Patch("profile")
  updateProfile(
    @Req() req: any,
    @Body() updateProfileDto: UpdateUserProfileDto
  ) {
    return this.userProfileService.updateProfile(
      req.user.userId,
      updateProfileDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete("profile")
  deleteProfile(@Req() req: any) {
    return this.userProfileService.deleteProfile(req.user.userId);
  }

  // Onboarding Management
  @UseGuards(JwtAuthGuard)
  @Get("onboarding/status")
  getOnboardingStatus(@Req() req: any) {
    return this.userProfileService.getOnboardingStatus(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("onboarding/skip")
  skipOnboarding(@Req() req: any, @Body() skipDto: SkipOnboardingDto) {
    return this.userProfileService.skipOnboarding(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch("onboarding/:step")
  updateOnboardingStep(
    @Req() req: any,
    @Param("step") step: string,
    @Body() body: { completed: boolean }
  ) {
    if (step !== "profile" && step !== "financial") {
      throw new Error('Invalid step. Must be "profile" or "financial"');
    }
    return this.userProfileService.updateOnboardingStatus(
      req.user.userId,
      step as "profile" | "financial",
      body.completed
    );
  }
}
