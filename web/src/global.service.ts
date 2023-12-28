import User from "./users/user.entity";

export class GlobalService{
  static runtime: number = 0;
}

export class CommandStatus{
  static cmdStatus: any = {};
  
  // 명령어가 이미 동작 중인지 검사
  static isRunningCommand(user: User, req: string, room: string): boolean {
    CommandStatus.initDict(user, req, room);
    // console.log("isRunningCommand");
    console.log(CommandStatus.cmdStatus[user.dong][user.ho][req][room]);
    if (CommandStatus.cmdStatus[user.dong][user.ho][req][room]['command']['status'] == 1) {
      let now: number = new Date().getTime();
      //시간이 많이 지나면 종료된것으로 간주
      if (now - CommandStatus.cmdStatus[user.dong][user.ho][req][room]['command']['time'] > 10000) {
        console.log("시간 넘음");
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  static setRunningCommand(user: User, req: string, room: string): boolean {
    if (! CommandStatus.isRunningCommand(user, req, room)) {
      CommandStatus.cmdStatus[user.dong][user.ho][req][room]['command']['status'] = 1;
      CommandStatus.cmdStatus[user.dong][user.ho][req][room]['command']['time'] = new Date().getTime();
      return true;
    } else {
      return false;
    }
  }

  static async waitRunningCommand(user: User, req: string, room: string): Promise<boolean> {
    for (let i=0; i<20; i++) {
      if (CommandStatus.setRunningCommand(user, req, room)) {
        return true;
      }
      console.log("기다리는중");
      await sleep(0.3);
    }
    return false;
  }

  static async removeRunningCommand(user: User, req: string, room: string): Promise<void> {
    CommandStatus.cmdStatus[user.dong][user.ho][req][room]['command']['status'] = 0;
    await sleep(0.3);
  }

  static initDict(user: User, req: string, room: string) {
    try {
      // console.log("init");
      // console.log(CommandStatus.cmdStatus[user.dong][user.ho][req]);
    } catch (error) {

    }
    if (! CommandStatus.cmdStatus.hasOwnProperty(user.dong)) {
      CommandStatus.cmdStatus[user.dong] = {};
    }
    if (! CommandStatus.cmdStatus[user.dong].hasOwnProperty(user.ho)) {
      CommandStatus.cmdStatus[user.dong][user.ho] = {};
    }
    if (! CommandStatus.cmdStatus[user.dong][user.ho].hasOwnProperty(req)) {
      CommandStatus.cmdStatus[user.dong][user.ho][req] = {};
    }
    if (! CommandStatus.cmdStatus[user.dong][user.ho][req].hasOwnProperty(room)) {
      CommandStatus.cmdStatus[user.dong][user.ho][req][room] = {};
    }
    if (! CommandStatus.cmdStatus[user.dong][user.ho][req][room].hasOwnProperty('command')) {
      CommandStatus.cmdStatus[user.dong][user.ho][req][room]['command'] = {}
    }
    if (! CommandStatus.cmdStatus[user.dong][user.ho][req][room]['command'].hasOwnProperty('status')) {
      // console.log("stats없음");
      // console.log(CommandStatus.cmdStatus[user.dong][user.ho][req]);
      CommandStatus.cmdStatus[user.dong][user.ho][req][room]['command']['status'] = 0
    }
    // console.log("init_finish");
    // console.log(CommandStatus.cmdStatus[user.dong][user.ho][req]);
  }
}

function sleep(sec) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

export class bestinStatus {
  static biStatus: any = {};
}