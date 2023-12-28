import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { stringify } from 'querystring';
import { ApartService } from 'src/apart/apart.service';
import { LocalAuthenticationGuard } from 'src/authentication/localAuthentication.guard';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { LightService } from 'src/light/light.service';

@Controller('biosapi')
export class BiosapiController {
  constructor(private readonly lightService: LightService, private readonly apartService: ApartService) {}

  @UseGuards(LocalAuthenticationGuard)
  @Post('lighton')
  async ligthOn(@Req() request: RequestWithUser, @Body('roomNum') devNum: string, @Body('unitNum') unitNum: string) {
    let result: string;
    let user = request.user;
    try{
      console.log(`[Light On] address: ${user.dong}-${user.ho} devnum: ${devNum}, unitNum: ${unitNum}`);
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
      console.log(`[Light Off] address: ${user.dong}-${user.ho} devnum: ${devNum}, unitNum: ${unitNum}`);
      result = await this.lightService.requestLightOff(user, devNum, unitNum);
    } catch (error) {
      result = error;
    }
    return result;
  }

  @UseGuards(LocalAuthenticationGuard)
  @Get('lightstatus')
  async lighttStatus(@Req() request: RequestWithUser, @Body('roomNum') devNum: string, @Body('unitNum') unitNum: string) {
    let result;
    let user = request.user;
    try{
      console.log(`[Light Status] address: ${user.dong}-${user.ho} devnum: ${devNum}, unitNum: ${unitNum}`);
      result = await this.lightService.requestStatus(user, devNum, unitNum);
    } catch (error) {
      result = error;
    }
    return result;
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('elevator')
  async requestElevator(@Req() request: RequestWithUser, @Body('direction') direction: string) {
    let result: string;
    let user = request.user
    try {
      console.log(`[Request Elevator] address: ${user.dong}-${user.ho} direction: ${direction}`);
      result = await this.apartService.requestElevator(user, direction);
      
    } catch (error) {
      result = error;
    }
    return result;
  }
}
