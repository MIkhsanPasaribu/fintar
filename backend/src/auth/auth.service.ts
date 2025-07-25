import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { SupabaseService } from "../common/supabase/supabase.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // First try Supabase auth
    const { data: supabaseUser, error } = await this.supabaseService.signIn(
      email,
      password
    );

    if (supabaseUser?.user && !error) {
      const { user } = supabaseUser;
      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email,
      };
    }

    // Fallback to local user validation
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(email: string, password: string, name: string) {
    try {
      // Register with Supabase
      const { data: supabaseUser, error: supabaseError } =
        await this.supabaseService.signUp(email, password);

      if (supabaseError) {
        throw new UnauthorizedException(supabaseError.message);
      }

      // Create user record in our database
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.usersService.create({
        email,
        username: email.split("@")[0], // Generate username from email
        password: hashedPassword,
        firstName: name || email.split("@")[0],
        supabaseId: supabaseUser.user?.id,
      });

      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException("Registration failed");
    }
  }

  async logout() {
    return await this.supabaseService.signOut();
  }
}
