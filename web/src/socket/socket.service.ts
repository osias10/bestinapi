import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
var net = require('net');

@Injectable()
export class SocketService {
    async requestSocket(reqIp: string, reqName: string, action: string, devNum: string, unitNum: string, ctrlAction: string): Promise<string> {
      
      try {
        let result: string = await sendcommand(reqIp, 9999, makeXml('1.1.1.1', reqName, action, devNum, unitNum, ctrlAction))
        return result;
      } catch (error) {
        console.log('서버에 접근할 수 없습니다.')
        throw new HttpException(
          '서버에 접근할 수 없습니다.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      
    }
}

function makeXml(wallpadIp:string, reqname: string, action: string, devNum: string ='null', unitNum:string ='null', ctrlAction: string='null'): string {
    let request: string = `<?xml version="1.0" encoding="utf-8"?>
                    <imap ver = "1.0" address ="${wallpadIp}" sender = "mobile">
                   	<service type = "request" name = "${reqname}">
                   		<target name = "internet" id = "1" msg_no = "11"/>
                   		<action>"${action}"</action>
                   		<params dev_num = "${devNum}" unit_num = "${unitNum}" ctrl_action = "${ctrlAction}"/>
                   	</service>
                  </imap>`
    return request;

}

function sendcommand(host: string, port: number, msg) {
  const socket = new net.Socket();
 
  return new Promise<string> (async (resolve, reject) => {
    try {
      await socket.connect({port: port, host: host}, async () => {});
      console.log('Connected');
      let packetRecv: string = await packetsend(socket, msg);
      console.log('Received data => '+ packetRecv);

      if (packetRecv === 'some') {
          console.log("ok");
      }    
      resolve(packetRecv);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }).catch(function(error) {
    console.log(error);
    throw error;
  });
}

function packetsend (sockeT, packeT) {
  return new Promise<string> ((resolve, reject) => {
    try {
      if (sockeT) {
          sockeT.write(packeT);
          sockeT.on('data', (data) => {
            sockeT.end();
            clearTimeout(limitTime);
            resolve(data.toString());
          });
          sockeT.on('error', (error) => {
            console.log('소켓 에러')
            reject(error);
          });
      }
      else{
          console.log('Missing')
          reject('Missing sockeT');
      }
      let limitTime = setTimeout(function() {
        console.log("[ERROR] Attempt at connection exceeded timeout value");
        sockeT.end();
        resolve('error');
      }, 10000);
    } catch (error) {
      console.log('error')
      resolve('error')
    }
  }).catch(function(error) {
    console.log(error)
    throw error;
  });
}