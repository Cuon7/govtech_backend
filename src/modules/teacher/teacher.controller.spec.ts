import { Test, TestingModule } from '@nestjs/testing';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';

describe('TeacherController', () => {
    let controller: TeacherController;
    let service: TeacherService;

    const mockTeacherService = {
        registerStudents: jest.fn(() => Promise.resolve()),
        getCommonStudents: jest.fn(() => Promise.resolve(['student1@gmail.com', 'student2@gmail.com'])),
        suspendStudent: jest.fn(() => Promise.resolve()),
        retrieveForNotification: jest.fn(() => Promise.resolve(['student1@gmail.com'])),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TeacherController],
            providers: [{ provide: TeacherService, useValue: mockTeacherService }],
        }).compile();

        controller = module.get<TeacherController>(TeacherController);
        service = module.get<TeacherService>(TeacherService);
    });

    describe('root', () => {
        it('should register students', async () => {
            await expect(
                controller.register({ teacher: 'teacherken@gmail.com', students: ['student1@gmail.com'] }),
            ).resolves.toBeUndefined();
            expect(mockTeacherService.registerStudents).toHaveBeenCalledWith(
                'teacherken@gmail.com',
                ['student1@gmail.com'],
            );
        });

        it('should return common students', async () => {
            const result = await controller.getCommonStudents('teacherken@gmail.com');
            expect(result).toEqual({ students: ['student1@gmail.com', 'student2@gmail.com'] });
        });

        it('should suspend a student', async () => {
            await expect(controller.suspendStudent({ student: 'student1@gmail.com' })).resolves.toBeUndefined();
            expect(mockTeacherService.suspendStudent).toHaveBeenCalledWith('student1@gmail.com');
        });

        it('should retrieve recipients for notifications', async () => {
            const result = await controller.retrieveForNotifications({
                teacher: 'teacherken@gmail.com',
                notification: 'Hello @student1@gmail.com',
            });
            expect(result).toEqual({ recipients: ['student1@gmail.com'] });
        });
    });
});