import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Config } from './config.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConfigService {
    constructor(
        @InjectRepository(Config)
        private configRepository: Repository<Config>
    ) {}

    async getElvServer() {
        return await this.configRepository.findOneBy( {server_name: "elevator" });
    }
    
    async getParkInfoServer() {
        return await this.configRepository.findOneBy( {server_name: "parkInfo" });
    }
}
