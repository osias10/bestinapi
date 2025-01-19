import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloController } from './hello/hello.controller';
import { HelloService } from './hello/hello.service';
import { SocketService } from './socket/socket.service';
import { LightService } from './light/light.service';
import { SocketModule } from './socket/socket.module';
import { BiosapiController } from './biosapi/biosapi.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { typeORMConfig } from 'typeorm.config';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { AuthenticationService } from './authentication/authentication.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { ApartService } from './apart/apart.service';
import { Config } from './config/config.entity';
import { ConfigModule } from './config/config.module';
import { HeaterService } from './heater/heater.service';
import { FanService } from './fan/fan.service';
import { GasService } from './gas/gas.service';

@Module({
  imports: [SocketModule, TypeOrmModule.forRoot(typeORMConfig), UsersModule, AuthenticationModule, ConfigModule],
  controllers: [AppController, HelloController, BiosapiController],
  providers: [AppService, HelloService, LightService, AuthenticationService, ApartService, HeaterService, FanService, GasService],
})
export class AppModule {}
