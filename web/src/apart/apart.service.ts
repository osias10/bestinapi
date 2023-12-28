import { Injectable } from '@nestjs/common';
import { SocketService } from 'src/socket/socket.service';
import User from 'src/users/user.entity';

@Injectable()
export class ApartService {
  constructor(private readonly socketService: SocketService) {}
  async requestElevator(user: User, direction: string) {
    let elvServerIp = "10.0.1.1";
    let request: string = this.makeElvXml(user.ip, direction);
    try {
      let result = await this.socketService.requestSocket(elvServerIp, 10000, request);
      return this.makeResult(getSuccessXmlResult(result));
    } catch (error) {
      console.log("Elv Error");
      throw error;
    }
  }

  makeElvXml(user: User, direction: string) {
    let event = "elevator_dn";
  
    if (direction == "up") {
      event = "elevator_up";
    } else {
      event = "elevator_dn";
    }
  
    let request = `<?xml version="1.0" encoding="utf-8"?>
      <imap ver = "1.0" address = "${user.ip}" sender = "${user.dong}동 ${user.ho}호">
        <service type = "request" name= "event_notify">
        <event> "${event}" </event>
      </service>
     </imap>
    `
    return request;
  }

  makeResult(isSuccess: boolean): string {
    if (isSuccess) {
      return "Success";
    } else {
      return "Fail";
    }
  }
}


function getSuccessXmlResult(result: string): boolean {
  // let xmlParser = new XMLParser();
  // let resultJson = xmlParser.parse(result);
  // console.log(resultJson);

  let resultValue = result.match(/result="\w*"/g);
  let rs = resultValue.includes("ok");

  if (rs) {
    return true;
  } else {
    return false;
  }
}