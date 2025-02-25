import { ApiProperty } from "@nestjs/swagger";

export class NotificationDto {
    @ApiProperty()
    teacher: string;
    @ApiProperty()
    notification: string;
}