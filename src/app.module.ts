import { Module, OnModuleInit } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { TeacherModule } from './modules/teacher/teacher.module';
import { SeedService } from './seed/seed.service';
import * as dotenv from 'dotenv';

dotenv.config(); // Load env
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Student, Teacher],
      synchronize: true,
    }),
    TeacherModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}
  async onModuleInit() {
    await this.seedService.seed();
  }
}
