import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Student } from "src/entities/student.entity";
import { Teacher } from "src/entities/teacher.entity";
import { TeacherController } from "./teacher.controller";
import { TeacherService } from "./teacher.service";
import { SeedService } from "src/seed/seed.service";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Teacher, Student]),
    ],
    controllers: [TeacherController],
    providers: [SeedService, TeacherService],
    exports: [SeedService]
})
export class TeacherModule {}