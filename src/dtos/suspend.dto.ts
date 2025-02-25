import { ApiProperty } from "@nestjs/swagger";

export class SuspendDto {
    @ApiProperty()
    student: string;
}