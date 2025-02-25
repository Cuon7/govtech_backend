import { Test, TestingModule } from '@nestjs/testing';
import { TeacherController } from '../teacher.controller';
import { TeacherService } from '../teacher.service';
import { NotificationDto } from '../../../dtos/notification.dto'
import { RegisterDto } from '../../../dtos/register.dto'
import { SuspendDto } from '../../../dtos/suspend.dto'
import { BadRequestException } from '@nestjs/common';

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

    describe("register", () => {
        it("should throw BadRequestException if teacher or students are not provided", async () => {
            const dto: RegisterDto = { teacher: "", students: [] };
            await expect(controller.register(dto)).rejects.toThrow(BadRequestException);
        });

        it("should call registerStudents on TeacherService", async () => {
            const dto: RegisterDto = { teacher: "teacher@example.com", students: ["student1@example.com"] };
            await controller.register(dto);
            expect(service.registerStudents).toHaveBeenCalledWith(dto.teacher, dto.students);
        });
    });

    describe("getCommonStudents", () => {
        it("should throw BadRequestException if no teacher is provided", async () => {
            await expect(controller.getCommonStudents('')).rejects.toThrow(BadRequestException);
        });

        it("should return common students when teacher is a string", async () => {
            jest.spyOn(service, "getCommonStudents").mockResolvedValue(["student1@example.com"]);
            const result = await controller.getCommonStudents("teacher@example.com");
            expect(result).toEqual({ students: ["student1@example.com"] });
        });

        it("should return common students when teacher is an array", async () => {
            const teacherArray = ["teacher1@example.com", "teacher2@example.com"];
            jest.spyOn(service, "getCommonStudents").mockResolvedValue(["student2@example.com"]);
            const result = await controller.getCommonStudents(teacherArray);
            expect(result).toEqual({ students: ["student2@example.com"] });
        });
        
        it("should return common students", async () => {
            jest.spyOn(service, "getCommonStudents").mockResolvedValue(["student1@example.com"]);
            const result = await controller.getCommonStudents("teacher@example.com");
            expect(result).toEqual({ students: ["student1@example.com"] });
        });
    });

    describe("suspendStudent", () => {
        it("should throw BadRequestException if student email is not provided", async () => {
            const dto: SuspendDto = { student: "" };
            await expect(controller.suspendStudent(dto)).rejects.toThrow(BadRequestException);
        });

        it("should call suspendStudent on TeacherService", async () => {
            const dto: SuspendDto = { student: "student@example.com" };
            await controller.suspendStudent(dto);
            expect(service.suspendStudent).toHaveBeenCalledWith(dto.student);
        });
    });

    describe("retrieveForNotifications", () => {
        it("should throw BadRequestException if teacher or notification is missing", async () => {
            const dto: NotificationDto = { teacher: "", notification: "" };
            await expect(controller.retrieveForNotifications(dto)).rejects.toThrow(BadRequestException);
        });

        it("should return recipients", async () => {
            const dto: NotificationDto = { teacher: "teacher@example.com", notification: "Hello @student@example.com" };
            jest.spyOn(service, "retrieveForNotification").mockResolvedValue(["student@example.com"]);
            const result = await controller.retrieveForNotifications(dto);
            expect(result).toEqual({ recipients: ["student@example.com"] });
        });
    });
});