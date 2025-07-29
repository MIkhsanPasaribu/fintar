import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });

    this.logger.log(
      `JWT Strategy initialized with secret: ${!!configService.get<string>("JWT_SECRET")}`
    );
  }

  async validate(payload: any) {
    this.logger.log(
      `JWT validation called with payload: ${JSON.stringify(payload)}`
    );

    const user = {
      userId: payload.sub || payload.id || payload.userId,
      username: payload.username,
      email: payload.email,
      id: payload.sub || payload.id || payload.userId,
    };

    this.logger.log(
      `JWT validation successful, returning user: ${JSON.stringify(user)}`
    );
    return user;
  }
}
