import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

export interface JwtPayload {
  email: string;
  sub: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload) {
    this.logger.log(
      `JWT validation called with payload: ${JSON.stringify(payload)}`
    );

    const user = {
      userId: payload.sub,
      email: payload.email,
      id: payload.sub, // Alias for backward compatibility
    };

    this.logger.log(
      `JWT validation successful, returning user: ${JSON.stringify(user)}`
    );
    return user;
  }
}
