import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty()
    teacher: string;
    @ApiProperty()
    students: string[];
}