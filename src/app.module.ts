import { Module } from '@nestjs/common';
import { EquipmentModule } from './equipment/equipment.module';
import { LoanRequestsModule } from './loan-requests/loan-requests.module';
import { LabsModule } from './labs/labs.module';
import { MaintenanceLogsModule } from './maintenance-logs/maintenance-logs.module';

@Module({
  imports: [
    EquipmentModule,
    LoanRequestsModule,
    LabsModule,
    MaintenanceLogsModule,
  ],
})
export class AppModule {}
