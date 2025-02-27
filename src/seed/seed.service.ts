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
        // Check if the database exists; if not, create it.
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        const dbName = process.env.DB_NAME;
        const dbExists = await queryRunner.query(
            `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${dbName}'`
        );
        if (dbExists.length === 0) {
            await queryRunner.query(`CREATE DATABASE ${dbName}`);
            console.log(`Database ${dbName} created.`);
        }
        else {
            console.log('Database exists.')
        }
        await queryRunner.release();

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