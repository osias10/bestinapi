import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import User from '../users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
      passReqToCallback: true
    });
  }
  async validate(req: any, email: string, password: string): Promise<User> {
    return this.authenticationService.getAuthenticatedUser(req.body.deviceSerial, email, password);
  }
}