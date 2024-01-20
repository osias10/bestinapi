import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { stringify } from 'querystring';
import { ApartService } from 'src/apart/apart.service';
import { LocalAuthenticationGuard } from 'src/authentication/localAuthentication.guard';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { FanService } from 'src/fan/fan.service';
import { HeaterService } from 'src/heater/heater.service';
import { LightService } from 'src/light/light.service';

@Controller('biosapi')
export class BiosapiController {
  constructor(
    private readonly lightService: LightService,
    private readonly apartService: ApartService,
    private readonly heaterService: HeaterService,
    private readonly fanService: FanService) {}

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
      result = await this.lightService.requestLightStatus(user, devNum, unitNum);
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

  @UseGuards(LocalAuthenticationGuard)
  @Get('heater')
  async heaterStatus(@Req() request: RequestWithUser, @Body('unitNum') unitNum: string) {
    let result;
    let user = request.user;
    try{
      console.log(`[Heater Status] address: ${user.dong}-${user.ho} unitNum: ${unitNum}`);
      result = await this.heaterService.requestHeaterStatus(user, unitNum);
    } catch (error) {
      result = error;
    }
    return result;
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('heater')
  async heater(@Req() request: RequestWithUser, @Body('unitNum') unitNum: string, @Body('unitStatus') unitStatus: string, @Body('unitTemp') unitTemp: number) {
    let result;
    let user = request.user
    console.log(`[Heater Request] address: ${user.dong}-${user.ho} unitNum: ${unitNum}, unitStatus: ${unitStatus}, unitTemp: ${unitTemp} `);
    if (unitStatus != "on" && unitStatus != "off") {
      console.log(`[Heater Request] address: ${user.dong}-${user.ho} unitStatus error: ${unitStatus}`)
      throw new HttpException(
        '잘못된 파라미터 입니다.',
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      result = await this.heaterService.requestHeater(user, unitNum, unitStatus, unitTemp);
    } catch (error) {
      result = error;
    }
    return result;
  }

  @UseGuards(LocalAuthenticationGuard)
  @Get('fan')
  async fanStatus(@Req() request: RequestWithUser) {
    let result;
    let user = request.user;
    try{
      console.log(`[Fan Status] address: ${user.dong}-${user.ho}`);
      result = await this.fanService.requestFanStatus(user);
    } catch (error) {
      result = error;
    }
    return result;
  }

  @UseGuards(LocalAuthenticationGuard)
  @Post('fan')
  async fan(@Req() request: RequestWithUser, @Body('unitStatus') unitStatus: string) {
    let result;
    let user = request.user
    console.log(`[Fan Request] address: ${user.dong}-${user.ho}, unitStatus: ${unitStatus}`);
    if (unitStatus != "on" && unitStatus != "off" && unitStatus != "low" && unitStatus != "mid" && unitStatus != "high" ) {
      console.log(`[Fan Request] address: ${user.dong}-${user.ho} unitStatus error: ${unitStatus}`)
      throw new HttpException(
        '잘못된 파라미터 입니다.',
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      result = await this.fanService.requestFan(user, unitStatus);
    } catch (error) {
      result = error;
    }
    return result;
  }
  
}
