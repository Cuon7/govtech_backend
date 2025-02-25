import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from '../seed.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Teacher } from '../../entities/teacher.entity';
import { Student } from '../../entities/student.entity';
import { Repository } from 'typeorm';

describe('SeedService', () => {
  let service: SeedService;
  let teacherRepository: Repository<Teacher>;
  let studentRepository: Repository<Student>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: getRepositoryToken(Teacher),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Student),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
    teacherRepository = module.get<Repository<Teacher>>(getRepositoryToken(Teacher));
    studentRepository = module.get<Repository<Student>>(getRepositoryToken(Student));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should seed data if no teachers exist', async () => {
    teacherRepository.find = jest.fn().mockResolvedValue([]);
    teacherRepository.create = jest.fn().mockImplementation((data) => data as Teacher);
    studentRepository.create = jest.fn().mockImplementation((data) => data as Student);
    teacherRepository.save = jest.fn().mockResolvedValue({ id: 1, email: 'firstTeacher@gmail.com', students: [] } as Teacher);

    await service.seed();
    expect(teacherRepository.find).toHaveBeenCalled();
    expect(teacherRepository.create).toHaveBeenCalled();
    expect(teacherRepository.save).toHaveBeenCalled();
  });

  it('should not seed data if teachers already exist', async () => {
    teacherRepository.find = jest.fn().mockResolvedValue([{ email: 'existingTeacher@gmail.com' } as Teacher]);

    await service.seed();
    expect(teacherRepository.find).toHaveBeenCalled();
    expect(teacherRepository.create).not.toHaveBeenCalled();
    expect(teacherRepository.save).not.toHaveBeenCalled();
  });
});
