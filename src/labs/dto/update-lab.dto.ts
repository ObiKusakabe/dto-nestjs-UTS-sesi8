import { IsEnum, IsInt, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';
import { LabStatus } from '../lab.interface';

export class UpdateLabDto {
  @IsOptional()
  @IsString()
  @Matches(/^ROOM-[A-Z]{2}-[0-9]{2}$/, {
    message: 'labCode must match pattern ROOM-XX-00 (e.g. ROOM-EL-01)',
  })
  labCode?: string;

  @IsOptional()
  @IsString()
  @Length(3, 80)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(2, 50)
  building?: string;

  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(100)
  capacity?: number;

  @IsOptional()
  @IsString()
  @Length(3, 70)
  picName?: string;

  @IsOptional()
  @IsEnum(LabStatus)
  status?: LabStatus;
}
