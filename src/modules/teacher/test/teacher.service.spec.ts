import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from '../teacher.service';
import { Repository } from 'typeorm';
import { Teacher } from '../../../entities/teacher.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Student } from '../../../entities/student.entity';
import { NotFoundException } from '@nestjs/common';

describe('TeacherService', () => {
  let service: TeacherService;
  let teacherRepository: Repository<Teacher>;
  let studentRepository: Repository<Student>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        {
          provide: getRepositoryToken(Teacher),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Student),
          useClass: Repository,
        }
      ],
    }).compile();
    service = module.get<TeacherService>(TeacherService);
    teacherRepository = module.get<Repository<Teacher>>(getRepositoryToken(Teacher));
    studentRepository = module.get<Repository<Student>>(getRepositoryToken(Student));
  });

  describe('registerStudents', () => {
    it('should throw NotFoundException if teacher is not found', async () => {
      jest.spyOn(teacherRepository, "findOne").mockResolvedValue(null);
      await expect(service.registerStudents('teacherken@gmail.com', ['student1@gmail.com'])).rejects.toThrow(NotFoundException);
    });

    it("should throw NotFoundException if a student does not exist", async () => {
      jest.spyOn(teacherRepository, "findOne").mockResolvedValue({ id: 1, email: "teacher@example.com", students: [] } as Teacher);
      jest.spyOn(studentRepository, "findOne").mockResolvedValue(null);
      await expect(service.registerStudents("teacher@example.com", ["student1@gmail.com"])).rejects.toThrow(NotFoundException);
    });

    it("should register students successfully", async () => {
      const teacher = { id: 1, email: "teacher@example.com", students: [] } as Teacher;
      const student = { id: 1, email: "student1@example.com" } as Student;

      jest.spyOn(teacherRepository, "findOne").mockResolvedValue(teacher);
      jest.spyOn(studentRepository, "findOne").mockResolvedValue(student);
      jest.spyOn(teacherRepository, "save").mockResolvedValue(teacher);

      await service.registerStudents("teacher@example.com", ["student1@example.com"]);

      expect(teacher.students).toContain(student);
      expect(teacherRepository.save).toHaveBeenCalledWith(teacher);
    });

    it("should not add duplicate students", async () => {
      // Start with a teacher that already has the student
      const teacher = { id: 1, email: "teacher@example.com", students: [] } as Teacher;
      const student = { id: 1, email: "student1@example.com" } as Student;
      
      // First registration call
      jest.spyOn(teacherRepository, "findOne").mockResolvedValue(teacher);
      jest.spyOn(studentRepository, "findOne").mockResolvedValue(student);
      jest.spyOn(teacherRepository, "save").mockResolvedValue(teacher);

      await service.registerStudents("teacher@example.com", ["student1@gmail.com"]);
      // Call again with the same student email
      await service.registerStudents("teacher@example.com", ["student1@gmail.com"]);

      // Expect that the student was not added a second time.
      expect(teacher.students.filter(s => s.email === student.email).length).toBe(1);
    });
  });

  describe("getCommonStudents", () => {
    it("should throw NotFoundException if one or more teachers are missing", async () => {
      jest.spyOn(teacherRepository, "find").mockResolvedValue([]);
      await expect(service.getCommonStudents(["teacher@example.com"])).rejects.toThrow(NotFoundException);
    });

    it("should return common students for multiple teachers", async () => {
      const teachers = [
        { email: "teacher1@example.com", students: [{ email: "student1@example.com" }, { email: "student2@example.com" }] } as Teacher,
        { email: "teacher2@example.com", students: [{ email: "student1@example.com" }] } as Teacher,
      ];
      jest.spyOn(teacherRepository, "find").mockResolvedValue(teachers);
      const result = await service.getCommonStudents(["teacher1@example.com", "teacher2@example.com"]);
      expect(result).toEqual(["student1@example.com"]);
    });

    it("should return all students if only one teacher is provided", async () => {
      const teacher = {
        email: "teacher@example.com",
        students: [{ email: "student1@example.com" }, { email: "student2@example.com" }],
      } as Teacher;
      jest.spyOn(teacherRepository, "find").mockResolvedValue([teacher]);
      const result = await service.getCommonStudents(["teacher@example.com"]);
      expect(result).toEqual(["student1@example.com", "student2@example.com"]);
    });
  });

  describe("suspendStudent", () => {
    it("should throw NotFoundException if student does not exist", async () => {
      jest.spyOn(studentRepository, "findOne").mockResolvedValue(null);
      await expect(service.suspendStudent("student@example.com")).rejects.toThrow(NotFoundException);
    });

    it("should suspend student successfully", async () => {
      const student = { email: "student@example.com", isSuspended: false } as Student;
      jest.spyOn(studentRepository, "findOne").mockResolvedValue(student);
      jest.spyOn(studentRepository, "save").mockResolvedValue(student);
      await service.suspendStudent("student@example.com");
      expect(student.isSuspended).toBe(true);
      expect(studentRepository.save).toHaveBeenCalledWith(student);
    });
  });

  describe("retrieveForNotification", () => {
    it("should throw NotFoundException if teacher does not exist", async () => {
      jest.spyOn(teacherRepository, "findOne").mockResolvedValue(null);
      await expect(service.retrieveForNotification("teacher@example.com", "Hello @student@example.com")).rejects.toThrow(NotFoundException);
    });

    it("should return teacher's non-suspended students when no mention is present", async () => {
      const teacher = {
        email: "teacher@example.com",
        students: [
          { email: "student1@example.com", isSuspended: false },
          { email: "student2@example.com", isSuspended: true },
        ],
      } as Teacher;
      jest.spyOn(teacherRepository, "findOne").mockResolvedValue(teacher);
      // Ensure that no additional student is found via mention.
      jest.spyOn(studentRepository, "findOne").mockResolvedValue(null);
      const result = await service.retrieveForNotification("teacher@example.com", "Hello everyone");
      expect(result).toEqual(["student1@example.com"]);
    });

    it("should return students including a valid mentioned student", async () => {
      const teacher = {
        email: "teacher@example.com",
        students: [
          { email: "student1@example.com", isSuspended: false },
          { email: "student2@example.com", isSuspended: true },
        ],
      } as Teacher;
      jest.spyOn(teacherRepository, "findOne").mockResolvedValue(teacher);
      // For the mentioned student, return a non-suspended student.
      jest.spyOn(studentRepository, "findOne").mockResolvedValue({ email: "student3@example.com", isSuspended: false } as Student);
      const result = await service.retrieveForNotification("teacher@example.com", "Hello @student3@example.com");
      // Both teacher's non-suspended student and the mentioned student should be returned.
      expect(result).toEqual(["student1@example.com", "student3@example.com"]);
    });

    it("should not add a mentioned student if they are suspended", async () => {
      const teacher = {
        email: "teacher@example.com",
        students: [
          { email: "student1@example.com", isSuspended: false },
        ],
      } as Teacher;
      jest.spyOn(teacherRepository, "findOne").mockResolvedValue(teacher);
      // For the mentioned student, return a suspended student.
      jest.spyOn(studentRepository, "findOne").mockResolvedValue({ email: "student2@example.com", isSuspended: true } as Student);
      const result = await service.retrieveForNotification("teacher@example.com", "Hello @student2@example.com");
      // Only teacher's non-suspended student should be returned.
      expect(result).toEqual(["student1@example.com"]);
    });
  });
});
