import { Injectable } from '@nestjs/common';
import { SocketService } from 'src/socket/socket.service';
import User from 'src/users/user.entity';
const xmlConvert = require('xml-js');

@Injectable()
export class HeaterService {

  constructor(private readonly socketService: SocketService) {}

  async requestHeaterStatus(user: User, unitNum: string): Promise<Object> {
    if (true) {
      try {
        let requestResult = await this.socketService.requestSocket(user.ip, 10000, makeHeaterXml(user.ip, "status", unitNum, "null"));
        let result = {};
        result["data"] = getHeaterStatusXmlResult(requestResult);
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

  async requestHeater(user: User, unitNum: string, status: string, temp: number): Promise<Object> {
    temp = Math.trunc(temp)
    let unitStatus = `${status}/${temp}`
    try {
      let requestResult = await this.socketService.requestSocket(user.ip, 10000, makeHeaterXml(user.ip, "control", unitNum, unitStatus));
      let result = {};
      result["data"] = getHeaterStatusXmlResult(requestResult);
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

function makeHeaterXml(wallpadIp:string, action: string, unitNum:string ='null', ctrlAction: string='null'): string {
    let request: string = `<?xml version="1.0" encoding="utf-8"?>
                            <imap ver = "1.0" address ="${wallpadIp}" sender = "mobile">
                                <service type = "request" name = "remote_access_temper">
                                    <target name = "internet" id = "1" msg_no = "11"/>
                                    <action>"${action}"</action>
                                    <params dev_num = "1" unit_num = "${unitNum}" ctrl_action = "${ctrlAction}"/>
                                </service>
                            </imap>`
    return request
}

function getHeaterStatusXmlResult(xml: string): Object {
    let resultJson = xmlConvert.xml2js(xml, {compact: true, spaces: 2});
    //console.log(resultJson);

    let resultList = resultJson["imap"]["service"]["status_info"];
    let result = {};
    result["unitNum"] = resultList["_attributes"]["unit_num"];
    let unitStatus: string = resultList["_attributes"]["unit_status"];
    let unitStatusList = unitStatus.split('/');
    result["unitStatus"] = unitStatusList[0];
    result["setTemp"] = unitStatusList[1];
    result["nowTemp"] = unitStatusList[2];
    
    return result;
  }