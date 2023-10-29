import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LocalAuthenticationGuard } from './localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';
import CreateUserDto from 'src/users/dto/createUser.dto';
import { ResponseMessage } from 'src/global/response.decorator';

@Controller('authentication')
export class AuthenticationController {
	constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: CreateUserDto) {
    return await this.authenticationService.register(registrationData);
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const user = request.user;
    console.log(user);
    user.password = undefined;
    let data = {};
    data['user'] = user;
    data['message'] = "aaa";
    return data;
  }

}
