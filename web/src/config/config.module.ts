import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from './config.entity';
import { SocketService } from 'src/socket/socket.service';
import { ConfigService } from './config.service';

@Module({
	imports: [TypeOrmModule.forFeature([Config])],
	providers: [ConfigService],
  	exports: [ConfigService],
})
export class ConfigModule {}
