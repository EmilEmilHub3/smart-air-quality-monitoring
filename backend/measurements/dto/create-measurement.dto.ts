import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class CreateMeasurementDto {
  @ApiProperty({ example: 45.5 })
  @IsNumber()
  @Min(0)
  @Max(100)
  humidity: number;

  @ApiProperty({ example: 22.1 })
  @IsNumber()
  @Min(-40)
  @Max(80)
  temperature: number;

  @ApiProperty({ example: 34 })
  @IsNumber()
  @Min(0)
  radonShortTermAvg: number;

  @ApiProperty({ example: 29 })
  @IsNumber()
  @Min(0)
  radonLongTermAvg: number;
}
