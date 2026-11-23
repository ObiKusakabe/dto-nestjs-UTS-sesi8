import { IsDateString, IsEnum, IsString, Length, Matches } from 'class-validator';
import { MaintenanceSeverity } from '../maintenance-log.interface';

export class CreateMaintenanceLogDto {
  @IsString()
  @Matches(/^LAB-[A-Z]{2}-[0-9]{3}$/, {
    message: 'assetCode must match pattern LAB-XX-000 (e.g. LAB-MM-001)',
  })
  assetCode: string;

  @IsString()
  @Length(3, 70)
  reportedBy: string;

  @IsString()
  @Length(10, 300)
  issueDescription: string;

  @IsEnum(MaintenanceSeverity)
  severity: MaintenanceSeverity;

  @IsDateString()
  scheduledDate: string;
}
