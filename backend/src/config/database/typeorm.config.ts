import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TypeOrmConfigService {
    constructor(private configService: ConfigService) { }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.configService.get<string>('DB_HOST'),
            port: this.configService.get<number>('DB_PORT'),
            username: this.configService.get<string>('DB_USERNAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_DATABASE'),
            entities: ['dist/**/*.entity{.ts,.js}'],
            migrations: ['dist/migrations/*{.ts,.js}'],
            migrationsRun: true,
            synchronize: this.configService.get<string>('NODE_ENV') === 'development',
            logging: false//this.configService.get<string>('NODE_ENV') === 'development',
        };
    }
}