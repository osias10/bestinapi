import { Controller, Get, Param, Query } from '@nestjs/common';
let global = require('../global.service');
var net = require('net');
import {SocketService} from '../socket/socket.service';
import { LightService } from 'src/light/light.service';
import { CommandStatus } from 'src/global.service';

@Controller('hello')
export class HelloController {
  constructor(private readonly socketService: SocketService, private readonly lightService: LightService) {}
  

  @Get('id')
  hello(@Query('id') id: string) {
    return `test id: ${id}`;
  }

  @Get('runtime')
  runtimetest() {
    global.GlobalService.runtime += 1;
    return `test time: ${global.GlobalService.runtime}`;
  }

  @Get('sockettest')
  async sockettest(@Query('msg') msg: string) {
    global.GlobalService.runtime += 1;
    //let result = getConnection(msg);
    //await writeData(testsocket, msg)
    //testsocket.destroy();

    let result: string = await sendcommand(msg);
    console.log(result);
    return `result: ${result}`;
  }

  @Get('socket')
  async socket(@Query('msg') msg: string) {
    //return this.socketService.requestSocket(msg);
  }

  @Get('cmdStatus')
  cmdStatus() {
    return CommandStatus.cmdStatus;
  }

  // @Get('lightsocket')
  // async ligthsocket(@Query('msg') msg: string) {
  //   return await this.lightService.request(msg);
  // }

}


// https://stackoverflow.com/questions/72511162/how-to-pass-data-from-net-socket-on-to-an-outside-variable-or-return-it
function sendcommand(msg) {
  const socket = new net.Socket();
  return new Promise<string> ((resolve) => {
    socket.connect({port: 9999, host:'127.0.0.1'}, async () => {
    try {
      console.log('Connected');
      let packetRecv: string = await packetsend(socket, msg);
    
      console.log('Received data => '+ packetRecv);
  
      if (packetRecv === 'some') {
          console.log("ok");
      }    
      resolve(packetRecv);
    }
    catch (error) {
      console.log(error);
    }
   });
  });
}

function packetsend (sockeT, packeT) {
  return new Promise<string> ((resolve, reject) => {
      if (sockeT) {
          sockeT.write(packeT);
          sockeT.on('data', (data) => {
            sockeT.end();
            resolve(data.toString());
          });
          sockeT.on('error', (error) => {
            reject(error);
          });
      }
      else{
          reject('Missing sockeT');
      }
  });
}

function getConnection(msg){
  var client = net.connect({port: 9999, host:'127.0.0.1'}, function() {
    console.log(' Connected: ');
    console.log('   local = %s:%s', this.localAddress, this.localPort);
    console.log('   remote = %s:%s', this.remoteAddress, this.remotePort);
    this.setTimeout(1000);
    this.setEncoding('utf8');
    this.write(msg);
    this.on('data', function(data) {
      console.log(" From Server: " + data.toString());
      this.end();
      return data;
    });
    this.on('end', function() {
      console.log(' Client disconnected');
    });
    this.on('error', function(err) {
      console.log('Socket Error: ', JSON.stringify(err));
    });
    this.on('timeout', function() {
      console.log('Socket Timed Out');
    });
    this.on('close', function() {
      console.log('Socket Closed');
    });
  });
  
}

async function writeData(socket, data){
  var success = await socket.write(data);
  if (success){
    console.log("send fail")
    // (function(socket, data){
    //   socket.once('drain', function(){
    //     writeData(socket, data);
    //   });
    // })(socket, data);
  }
}