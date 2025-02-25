import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "../entities/student.entity";
import { Teacher } from "../entities/teacher.entity";
import { Repository } from "typeorm";

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>,
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>
    ) { }

    async seed() {
        const teachers = await this.teacherRepository.find();
        if (teachers.length === 0) {
            const teacher = await this.teacherRepository.create({
                email: 'firstTeacher@gmail.com',
            })

            await this.teacherRepository.save(teacher);

        }
        const students = await this.studentRepository.find();
        if (students.length === 0) {
            const student1 = await this.studentRepository.create({
                email: '1stStudent@gmail.com'
            })
            const student2 = await this.studentRepository.create({
                email: '2ndStudent@gmail.com'
            })
            const student3 = await this.studentRepository.create({
                email: '3rdStudent@gmail.com'
            })
            await this.studentRepository.save([student1, student2, student3])
        }
    }
}