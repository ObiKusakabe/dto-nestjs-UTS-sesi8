import { IsDateString, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { MaintenanceSeverity } from '../maintenance-log.interface';

export class UpdateMaintenanceLogDto {
  @IsOptional()
  @IsString()
  @Length(10, 300)
  issueDescription?: string;

  @IsOptional()
  @IsEnum(MaintenanceSeverity)
  severity?: MaintenanceSeverity;

  @IsOptional()
  @IsDateString()
  scheduledDate?: string;
}
