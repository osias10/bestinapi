import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { stringify } from 'querystring';
import { LocalAuthenticationGuard } from 'src/authentication/localAuthentication.guard';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { LightService } from 'src/light/light.service';

@Controller('biosapi')
export class BiosapiController {
  constructor(private readonly lightService: LightService) {}

  @UseGuards(LocalAuthenticationGuard)
  @Post('lighton')
  async ligthOn(@Req() request: RequestWithUser, @Body('roomNum') devNum: string, @Body('unitNum') unitNum: string) {
    let result: string;
    let user = request.user;
    try{
      console.log(`devnum: ${devNum}, unitNum: ${unitNum}`);
      //console.log(request.user);
      result = await this.lightService.requestLightOn(user, devNum, unitNum);
    } catch (error) {
      console.log(error);
      result = error;
    }
    return result;
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('lightoff')
  async ligthOff(@Req() request: RequestWithUser, @Body('roomNum') devNum: string, @Body('unitNum') unitNum: string) {
    let result: string;
    let user = request.user;
    try{
      console.log(`devnum: ${devNum}, unitNum: ${unitNum}`);
      result = await this.lightService.requestLightOff(user, devNum, unitNum);
    } catch (error) {
      result = error;
    }
    return result;
  }

}
