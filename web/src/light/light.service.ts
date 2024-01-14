import { Injectable } from '@nestjs/common';
import {SocketService} from '../socket/socket.service';
import User from 'src/users/user.entity';
import { CommandStatus } from 'src/global.service';
const xmlConvert = require('xml-js');

@Injectable()
export class LightService {
  constructor(private readonly socketService: SocketService) {}
  
  async requestLightOn(user: User, devNum: string, unitNum: string): Promise<string> {
    //console.log(CommandStatus.cmdStatus);
    if (await CommandStatus.waitRunningCommand(user, "light", devNum)) {
      try {
        let result = await this.socketService.requestLightSocket(user.ip, "remote_access_light", "control", devNum, unitNum, "on");
        return this.makeResult(this.getSuccessXmlResult(result));
      } catch (error) {
        console.log ("socket 실행 에러 발생:" , error)
        return ("Socket Error")
      } finally {
        console.log ("[Light On] 실행 종료");
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
        let result = await this.socketService.requestLightSocket(user.ip, "remote_access_light", "control", devNum, unitNum, "off");
        return this.makeResult(this.getSuccessXmlResult(result));
      } catch (error) {
        console.log ("socket 실행 에러 발생:" , error)
        return ("Socket Error")
      } finally {
        console.log ("[Light Off] 실행 종료");
        await CommandStatus.removeRunningCommand(user, "light", devNum);
      }
      return "Success"
    } else {
      return "Timeout"
    } 
  }

  async requestLightStatus(user: User, devNum: string, unitNum: string): Promise<Object> {
    // if (await CommandStatus.waitRunningCommand(user, "light", devNum)) {
    if (true) {
      try {
        let requestResult = await this.socketService.requestLightSocket(user.ip, "remote_access_light", "status", devNum, unitNum, "");
        let result = {};
        result["data"] = this.getStatusXmlResult(requestResult);
        return result;
        if (this.getSuccessXmlResult(requestResult)) {
          //조회 성공시 전등 상태 확인
        } else {
          return "Fail";
        }
        
      } catch (error) {
        console.log ("socket 실행 에러 발생:" , error)
        return ("Socket Error")
      } finally {
        console.log ("[Light Status] 실행 종료");
        //await CommandStatus.removeRunningCommand(user, "light", devNum);
      }
      return "Success"
    } else {
      return "Timeout"
    } 
  }

  getSuccessXmlResult(result: string): boolean {
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
  
  //xml에서 ligth status 확인
  getStatusXmlResult(result: string): Array<Object> {
    let resultJson = xmlConvert.xml2js(result, {compact: true, spaces: 2});
    //console.log(resultJson);

    let resultList: Array<string> = resultJson["imap"]["service"]["status_info"];
    let statusList: Array<Object> = [];
    // console.log("resultList: ");
    // console.log(resultList);
    
    if (Array.isArray(resultList)) {
      for (let el of resultList) {
        // console.log("el");
        // console.log(el);
        let st = {};
        st["unitNum"] = el["_attributes"]["unit_num"];
        st["unitStatus"] = el["_attributes"]["unit_status"]
        statusList.push(st);
      }
    } else {
      let st = {};
      st["unitNum"] = resultList["_attributes"]["unit_num"];
      st["unitStatus"] = resultList["_attributes"]["unit_status"]
      statusList.push(st);
    }
    
    return statusList;
  }

  makeResult(isSuccess: boolean): string {
    if (isSuccess) {
      return "Success";
    } else {
      return "Fail";
    }
  }
}
