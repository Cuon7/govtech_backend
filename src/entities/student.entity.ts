import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Teacher } from "./teacher.entity";

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column({default: false})
    isSuspended: boolean;

    @ManyToMany(() => Teacher, teacher => teacher.students) teachers: Teacher[];
}