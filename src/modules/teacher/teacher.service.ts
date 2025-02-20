import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "../../entities/student.entity";
import { Teacher } from "../../entities/teacher.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(Teacher)
        private readonly teacherRepository: Repository<Teacher>,
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>
    ) { }

    async registerStudents(teacherEmail: string, studentEmails: string[]) {
        // Find or create teacher
        let teacher = await this.teacherRepository.findOne({
            where: { email: teacherEmail },
            relations: ['students'],
        });
        // Create teacher if not exists
        // if (!teacher) {
        //     console.log('Teacher created')
        //     teacher = await this.teacherRepository.create({
        //         email: teacherEmail,
        //         students: []
        //     })
        // }

        // Handle error when teacher not found
        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }
        // Find or create students
        for (const email of studentEmails) {
            let student = await this.studentRepository.findOne({
                where: { email: email }
            })
            // Create student if not exist
            // if (!student) {
            //     student = await this.studentRepository.create({
            //         email: email,   
            //         isSuspended: false
            //     })
            // }

            //Handle error when student not found
            if (!student) {
                throw new NotFoundException('Student not found');
            }
            // Check duplication
            if (!teacher.students.find((s) => s.email === student.email)) {
                teacher.students.push(student);
            }
        }
        await this.teacherRepository.save(teacher);

    }
    
    async getCommonStudents(teacherEmails: string[]) {
        const teachers = await this.teacherRepository.find({ where: { email: In(teacherEmails) }, relations: ['students'] });
        if (teachers.length !== teacherEmails.length) {
            throw new NotFoundException('One or more teacher not found');
        }
        // Get student emails for each teacher
        const studentsPerTeacher = teachers.map((teacher) => teacher.students.map((student) => student.email));
        // Common student
        const common = studentsPerTeacher.reduce((a, b) => a.filter((email) => b.includes(email)));
        return common;
    }

    async suspendStudent(studentEmail: string) {
        const student = await this.studentRepository.findOne({ where: { email: studentEmail } });
        if (!student) {
            throw new NotFoundException('Student not found');
        }
        student.isSuspended = true;
        await this.studentRepository.save(student);
    }

    async retrieveForNotification(teacherEmail: string, notification: string) {
        const teacher = await this.teacherRepository.findOne({ where: { email: teacherEmail }, relations: ['students'] });
        if (!teacher) {
            throw new NotFoundException('Teacher not found');
        }

        const recipientsSet = new Set<string>();
        teacher.students.forEach((student) => {
            if (!student.isSuspended) {
                recipientsSet.add(student.email);
            }
        })

        // Parse the notification text for @mentioned emails.
        const regex = /@([\w\.\-]+@[a-zA-Z_]+\.[a-zA-Z]{2,})/g;
        let match;
        while ((match = regex.exec(notification)) !== null) {
            const email = match[1];
            // Check that the mentioned student exists and is not suspended.
            const student = await this.studentRepository.findOne({ where: { email } });
            if (student && !student.isSuspended) {
                recipientsSet.add(student.email);
            }
        }

        return Array.from(recipientsSet);
    }

}