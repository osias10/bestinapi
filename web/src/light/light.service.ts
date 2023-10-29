import { Injectable } from '@nestjs/common';
import {SocketService} from '../socket/socket.service';
import User from 'src/users/user.entity';
import { CommandStatus } from 'src/global.service';

@Injectable()
export class LightService {
    constructor(private readonly socketService: SocketService) {}
    
    async requestLightOn(user: User, devNum: string, unitNum: string): Promise<string> {
      //console.log(CommandStatus.cmdStatus);
      if (await CommandStatus.waitRunningCommand(user, "light", devNum)) {
        try {
          let result = await this.socketService.requestSocket(user.ip, "remote_access_light", "control", devNum, unitNum, "on");
        } catch (error) {
          console.log ("socket 실행 에러 발생:" , error)
          return ("Socket Error")
        } finally {
          console.log ("실행 종료");
          await CommandStatus.removeRunningCommand(user, "light", devNum);
        }
        return "Success"
      } else {
        return "Timeout"
      } 
    }
    
    async requestLightOff(user: User, devNum: string, unitNum: string): Promise<string> {
      if (await CommandStatus.waitRunningCommand(user, "light", devNum)) {
        try {
          let result = await this.socketService.requestSocket(user.ip, "remote_access_light", "control", devNum, unitNum, "off");
        } catch (error) {
          console.log ("socket 실행 에러 발생:" , error)
          return ("Socket Error")
        } finally {
          console.log ("실행 종료");
          await CommandStatus.removeRunningCommand(user, "light", devNum);
        }
        return "Success"
      } else {
        return "Timeout"
      } 
    }
}
