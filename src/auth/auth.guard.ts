import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext) {
    const { authorization } = context.switchToHttp().getRequest().headers;

    return this.authService.isValidToken((authorization ?? '').split(' ')[1]);
  }
}
