import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { SocketService } from 'src/socket/socket.service';
import User from 'src/users/user.entity';
const xmlConvert = require('xml-js');

@Injectable()
export class ApartService {
  constructor(
    private readonly socketService: SocketService,
    private readonly configService: ConfigService
    ) {}
  async requestElevator(user: User, direction: string) {
    let elvServerIp: string = "10.0.1.1";
    let elvServerPort: number = 10000;
    try {
      let elvServer = await this.configService.getElvServer();
      if (elvServer.server_ip != null && elvServer.server_port != null) {
        elvServerIp = elvServer.server_ip;
        elvServerPort = elvServer.server_port;
      }
    } catch (error) {
      console.log("elvServerIp read fail");
    } finally {
      elvServerIp = "10.0.1.1";
      elvServerPort = 10000;
    }
    let request: string = this.makeElvXml(user, direction);
    //console.log(request);
    try {
      let result = await this.socketService.requestSocket(elvServerIp, elvServerPort, request);
      return this.makeResult(getSuccessXmlResult(result));
    } catch (error) {
      console.log("Elv Error");
      throw error;
    }
  }

  makeElvXml(user: User, direction: string): string {
    let event = "elevator_dn";
  
    if (direction == "up") {
      event = "elevator_up";
    } else {
      event = "elevator_dn";
    }
  
    let request: string = `<?xml version="1.0" encoding="utf-8"?>
      <imap ver = "1.0" address = "${user.ip}" sender = "mobile">
        <service type = "request" name= "event_notify">
        <event>"${event}"</event>
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
  
  //주차 위치

  async getParkInfo(user: User): Promise<object> {
    let parkInfoIp = "10.0.206.1";
    let parkInfoPort = 10000;
    try {
      let elvServer = await this.configService.getParkInfoServer();
      if (elvServer.server_ip != null && elvServer.server_port != null) {
        parkInfoIp = elvServer.server_ip;
        parkInfoPort = elvServer.server_port;
      }
    } catch (error) {
      console.log("elvServerIp read fail");
    }

    let request: string = this.makeParkInfoXml(user);
    try {
      let rs = await this.socketService.requestSocket(parkInfoIp, parkInfoPort, request);
      let resultJson = xmlConvert.xml2js(rs, {compact: true, spaces: 2});
      console.log(resultJson);
      if (this.makeResult(getSuccessXmlResult(rs))) {
        let data = {};
        data["location"] = resultJson["imap"]["service"]["park_info"]["_attributes"]["location_text"];
        let result = {};
        result["data"] = data;
        return result;
      }
    } catch (error) {
      console.log("parkInfo Error");
      throw error;
    }


  }

  makeParkInfoXml(user: User) {
    let request: string = `<?xml version="1.0" encoding="utf-8"?>
      <imap ver = "1.0" address = "${user.ip}" sender = "mobile">
        <service type = "request" name= "get_parkinfo">
            <source device="wallpad" id="${user.ip}" />
            <info_type>"home"</info_type>
            <home_info dong="${user.dong}" ho="${user.ho}" />
            <message>"null"</message>
        </service>
      </imap>
      `
    return request;
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