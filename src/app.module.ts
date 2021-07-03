import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

const mysqlCfg: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'db', //docker-compose service
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'admin',
  autoLoadEntities: true,
  synchronize: true,
};

@Module({
  imports: [TypeOrmModule.forRoot(mysqlCfg), UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
