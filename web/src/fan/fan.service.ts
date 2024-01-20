import { Injectable } from '@nestjs/common';
import { SocketService } from 'src/socket/socket.service';
import User from 'src/users/user.entity';
const xmlConvert = require('xml-js');

@Injectable()
export class FanService {
  constructor(private readonly socketService: SocketService) {}

  async requestFanStatus(user: User): Promise<Object> {
    if (true) {
      try {
        let requestResult = await this.socketService.requestSocket(user.ip, 10000, makeFanXml(user.ip, "status", "null"));
        let result = {};
        result["data"] = getFanStatusXmlResult(requestResult);
        return result;

      } catch (error) {
        console.log ("socket 실행 에러 발생:" , error)
        return ("Socket Error")
      } finally {
        console.log ("[Heater Status] 실행 종료");
        //await CommandStatus.removeRunningCommand(user, "light", devNum);
      }
      return "Success"
    } else {
      return "Timeout"
    } 
  }

  async requestFan(user: User, status: string): Promise<Object> {
  
    try {
      let requestResult = await this.socketService.requestSocket(user.ip, 10000, makeFanXml(user.ip, "control", status));
      let result = {};
      result["data"] = getFanStatusXmlResult(requestResult);
      return result;
                  
    } catch (error) {
      console.log ("socket 실행 에러 발생:" , error)
      return ("Socket Error")
    } finally {
      console.log ("[Heater Request] 실행 종료");
      //await CommandStatus.removeRunningCommand(user, "light", devNum);
    }
    return "Success"
  }

}

function makeFanXml(wallpadIp:string, action: string, ctrlAction: string='null'): string {
  let request: string = `<?xml version="1.0" encoding="utf-8"?>
                          <imap ver = "1.0" address ="${wallpadIp}" sender = "mobile">
                              <service type = "request" name = "remote_access_ventil">
                                  <target name = "internet" id = "1" msg_no = "11"/>
                                  <action>"${action}"</action>
                                  <params dev_num = "1" unit_num = "ventil" ctrl_action = "${ctrlAction}"/>
                              </service>
                          </imap>`
  return request
}

function getFanStatusXmlResult(xml: string): Object {
  let resultJson = xmlConvert.xml2js(xml, {compact: true, spaces: 2});
  //console.log(resultJson);

  let resultList = resultJson["imap"]["service"]["status_info"];
  let result = {};
  // result["unitNum"] = resultList["_attributes"]["unit_num"];
  let unitStatus: string = resultList["_attributes"]["unit_status"];

  result["unitStatus"] = unitStatus;

  
  return result;
}