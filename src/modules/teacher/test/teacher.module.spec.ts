import { Test, TestingModule } from '@nestjs/testing';
import { TeacherModule } from '../teacher.module';
import { TeacherService } from '../teacher.service';
import { TeacherController } from '../teacher.controller';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from '../../../entities/teacher.entity';
import { Student } from '../../../entities/student.entity';
import { Repository, DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from '../../../seed/seed.service';

describe('TeacherModule', () => {
  let moduleRef: TestingModule;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME_TEST,
            entities: [Student, Teacher],
            synchronize: true,
          }),
        TeacherModule,
      ],
      providers: [
        {
          provide: getRepositoryToken(Teacher),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Student),
          useClass: Repository,
        },
        {
          provide: DataSource,
          useValue: {
            getRepository: jest.fn(),
          },
        },
        SeedService,
        TeacherService,
      ],
      controllers: [TeacherController],
    }).compile();
  });

  it('should be defined', () => {
    expect(moduleRef).toBeDefined();
  });

  it('should have TeacherService', () => {
    const service = moduleRef.get<TeacherService>(TeacherService);
    expect(service).toBeDefined();
  });

  it('should have TeacherController', () => {
    const controller = moduleRef.get<TeacherController>(TeacherController);
    expect(controller).toBeDefined();
  });

  it('should have SeedService', () => {
    const seedService = moduleRef.get<SeedService>(SeedService);
    expect(seedService).toBeDefined();
  });
});
