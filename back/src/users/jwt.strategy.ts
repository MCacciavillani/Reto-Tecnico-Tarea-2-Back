import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class Payload {
  id: string;
  email: string;
  name: string;
  phone: string;
  messageCount: number;
  company: string;
  role: Role;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'mi_secreto_super_seguro',
    });
  }

  validate(payload: Payload) {
    return {
      userId: payload.id,
      email: payload.email,
      role: payload.role,
      name: payload.name,
      phone: payload.phone,
      messageCount: payload.messageCount,
      company: payload.company,
    };
  }
}
