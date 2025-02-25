import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Student } from './student.entity';
 
@Entity()
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column({ unique: true })
  email: string;
 
  @ManyToMany(() => Student, student => student.teachers)
  @JoinTable({
    name: 'teacher_student',
    joinColumn: { name: 'teacherId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'studentId', referencedColumnName: 'id' },
  })
  students: Student[];
}