import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { TeacherService } from "./teacher.service";
import { ApiBody, ApiOperation, ApiProperty, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { RegisterDto } from "../../dtos/register.dto";
import { SuspendDto } from "../../dtos/suspend.dto";
import { NotificationDto } from "../../dtos/notification.dto";


@Controller()
export class TeacherController {
    constructor(
        private readonly teacherService: TeacherService
    ) {}
    
    @Post('register')
    @ApiOperation({summary: 'Register students to a teacher'})
    @ApiBody({
        type: RegisterDto,
        description: 'Register one or more students to a teacher',
        required: true,
    })
    @ApiResponse({status: 204})
    @ApiResponse({status: 400, description: 'Bad Request - Teacher and Students must be provided'})
    @HttpCode(HttpStatus.NO_CONTENT)
    async register(@Body() body: RegisterDto) {
        if (!body.teacher || !body.students?.length) {
            throw new BadRequestException('Teacher and Students must be provided')
        }
        await this.teacherService.registerStudents(body.teacher, body.students);
        return;
    }

    @Get('commonstudents')
    async getCommonStudents (@Query('teacher') teacher: string | string[]) {
        if (!teacher) {
            throw new BadRequestException('At least one teacher should be specified')
        }
        const teachers = Array.isArray(teacher) ? teacher : [teacher];
        const students = await this.teacherService.getCommonStudents(teachers);
        return {students};
    }

    @Post('suspend')
    @HttpCode(HttpStatus.NO_CONTENT)
    async suspendStudent (@Body() body: SuspendDto) {
        if (!body.student) {
            throw new BadRequestException('Student email must be provided');
        }
        await this.teacherService.suspendStudent(body.student);
    }

    @Post('retrievefornotifications')
    async retrieveForNotifications (@Body() body: NotificationDto) {
        if (!body.teacher || !body.notification) {
            throw new BadRequestException('Teacher and notification must be provided');
        }
        const recipients = await this.teacherService.retrieveForNotification(body.teacher, body.notification);
        return {recipients};
    }    
}